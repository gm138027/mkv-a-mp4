import { writeFile, readFile, unlink } from 'fs/promises';
import { join } from 'path';
import PQueue from 'p-queue';
import { logger } from '@/lib/logger';
import { ensureDir } from '@/lib/fs-utils';
import { TASK_DIR } from '@/lib/config';
import type { CreateTaskInput, TaskRecord, UpdateTaskInput } from './types';

const taskPath = (id: string) => join(process.cwd(), TASK_DIR, `${id}.json`);

// 为每个任务 ID 创建独立的串行队列（concurrency: 1）
// 确保同一任务的所有写入操作按顺序执行，避免并发冲突
const taskQueues = new Map<string, PQueue>();

const getQueue = (id: string): PQueue => {
  if (!taskQueues.has(id)) {
    taskQueues.set(id, new PQueue({ concurrency: 1 }));
  }
  return taskQueues.get(id)!;
};

export const createTask = async ({ id, originalFilename, settings, sessionId }: CreateTaskInput) => {
  // 将创建操作加入该任务的串行队列
  try {
    return await getQueue(id).add(async () => {
      await ensureDir(join(process.cwd(), TASK_DIR));
      const timestamp = new Date().toISOString();
      const task: TaskRecord = {
        id,
        originalFilename,
        uploadFilename: `${id}.mkv`,
        status: 'queued',
        progress: 0,
        createdAt: timestamp,
        updatedAt: timestamp,
        ...(settings && { settings }),
        ...(sessionId && { sessionId }),  // ✅ Session ID
      };
      await writeFile(taskPath(id), JSON.stringify(task, null, 2), 'utf8');
      return task;
    });
  } catch (error) {
    // ✅ 修复：创建失败时清理队列，防止内存泄漏
    await getQueue(id).onIdle();
    taskQueues.delete(id);
    logger.log(`[TaskStore] 创建失败，清理队列: ${id}`);
    throw error;
  }
};

export const updateTask = async (id: string, update: UpdateTaskInput) => {
  // 将更新操作加入该任务的串行队列
  const result = await getQueue(id).add(async () => {
    const task = await readTask(id);
    const next: TaskRecord = {
      ...task,
      ...update,
      updatedAt: new Date().toISOString(),
    };
    await writeFile(taskPath(id), JSON.stringify(next, null, 2), 'utf8');
    return next;
  });

  // ✅ 任务结束后安全删除队列（避免内存累积）
  if (update.status === 'completed' || update.status === 'failed') {
    // 等待队列完全空闲后删除
    await getQueue(id).onIdle();
    taskQueues.delete(id);
    logger.log(`[TaskStore] 队列已删除: ${id}`);
  }

  return result;
};

/**
 * 读取任务记录（带重试机制）
 * 解决并发读写冲突导致的 JSON 解析失败
 * 使用指数退避策略：第1次 50ms，第2次 100ms，第3次 150ms...
 */
export const readTask = async (id: string, retries = 5): Promise<TaskRecord> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
  const raw = await readFile(taskPath(id), 'utf8');
  return JSON.parse(raw) as TaskRecord;
    } catch (err) {
      // 如果是 JSON 解析错误且还有重试次数，使用指数退避延迟后重试
      if (err instanceof SyntaxError && attempt < retries) {
        const delay = attempt * 50; // 50ms, 100ms, 150ms, 200ms...
        logger.warn(`[readTask] JSON 解析失败（尝试 ${attempt}/${retries}），${delay}ms 后重试...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      // 最后一次重试失败或其他错误，抛出
      throw err;
    }
  }
  // TypeScript 类型守卫（实际上不会执行到这里）
  throw new Error('读取任务失败');
};
