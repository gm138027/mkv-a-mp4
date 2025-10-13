import { unlink, readdir } from 'fs/promises';
import { join } from 'path';
import { glob } from 'glob';
import { UPLOAD_DIR, OUTPUT_DIR, TASK_DIR, DEFAULT_EXPIRY_HOURS } from '@/lib/config';
import { readTask } from './task-store';
import type { TaskRecord } from './types';

/**
 * 清理单个任务的所有相关文件
 * @param taskId 任务ID
 */
export const cleanupTask = async (taskId: string): Promise<void> => {
  const filesToClean = [
    join(process.cwd(), UPLOAD_DIR, `${taskId}.mkv`),
    join(process.cwd(), OUTPUT_DIR, `${taskId}.mp4`),
    join(process.cwd(), TASK_DIR, `${taskId}.json`),
  ];

  // 清理临时字幕文件
  try {
    const uploadDir = join(process.cwd(), UPLOAD_DIR);
    // ✅ 修复：扩展匹配模式，支持旧格式 subtitle_task_*
    const subtitleFiles = await glob(`${uploadDir}/subtitle_*${taskId}*.*`);
    const taskSubtitleFiles = await glob(`${uploadDir}/${taskId}_subtitle.*`);
    
    filesToClean.push(...subtitleFiles, ...taskSubtitleFiles);
  } catch (error) {
    console.error(`搜索字幕文件失败:`, error);
  }

  for (const filePath of filesToClean) {
    try {
      await unlink(filePath);
    } catch (error) {
      // 忽略文件不存在的错误，可能已经被清理过了
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        console.error(`清理文件失败 ${filePath}:`, error);
      }
    }
  }
};

/**
 * 检查任务是否已过期
 * @param task 任务记录
 * @returns 是否过期
 */
export const isTaskExpired = (task: TaskRecord): boolean => {
  if (!task.expiresAt) {
    // 如果没有设置过期时间，根据状态和创建时间判断
    const createdAt = new Date(task.createdAt);
    const now = new Date();
    const hoursElapsed = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

    if (task.status === 'completed') {
      return hoursElapsed > DEFAULT_EXPIRY_HOURS;
    } else if (task.status === 'failed') {
      return hoursElapsed > 24; // 失败任务保留24小时
    } else {
      return hoursElapsed > 48; // 其他状态保留48小时
    }
  }

  return new Date() > new Date(task.expiresAt);
};

/**
 * 获取所有任务ID
 * @returns 任务ID列表
 */
const getAllTaskIds = async (): Promise<string[]> => {
  try {
    const taskDir = join(process.cwd(), TASK_DIR);
    const files = await readdir(taskDir);
    return files
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''));
  } catch (error) {
    // 如果目录不存在，返回空数组（应用初始化会创建目录）
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.log('任务目录尚未创建，跳过清理');
      return [];
    }
    console.error('读取任务目录失败:', error);
    return [];
  }
};

/**
 * 清理所有过期任务
 */
export const cleanupExpiredTasks = async (): Promise<void> => {
  const taskIds = await getAllTaskIds();
  let cleanedCount = 0;

  for (const taskId of taskIds) {
    try {
      const task = await readTask(taskId);

      if (isTaskExpired(task)) {
        await cleanupTask(taskId);
        cleanedCount++;
        console.log(`已清理过期任务: ${taskId}`);
      }
    } catch (error) {
      console.error(`清理任务失败 ${taskId}:`, error);
    }
  }

  if (cleanedCount > 0) {
    console.log(`定时清理完成，共清理 ${cleanedCount} 个过期任务`);
  }
};


