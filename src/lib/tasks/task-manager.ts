/**
 * 任务管理器
 * 职责：任务的创建和查询（协调各个服务）
 * 遵循单一职责原则（SRP）和依赖倒置原则（DIP）
 */

import { randomUUID } from 'crypto';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { TASK_DIR, UPLOAD_DIR } from '@/lib/config';
import { ensureDir } from '@/lib/fs-utils';
import { taskStore } from './task-store-adapter';
import { conversionService } from './conversion-service';
import { cleanupService } from './cleanup-service';
import { TaskScheduler } from './task-scheduler';
import { readTask } from './task-store';
import type { TaskRecord } from './types';
import type { AdvancedSettings } from '@/shared/advanced-settings';  // ✅ P1: 使用共享模块

/**
 * 将 File 对象转换为 Buffer
 */
const fileToBuffer = async (file: File): Promise<Buffer> => {
  return Buffer.from(await file.arrayBuffer());
};

/**
 * 创建任务调度器实例
 */
const taskScheduler = new TaskScheduler(
  taskStore,
  conversionService,
  cleanupService
);

/**
 * @param file 上传的文件
 * @param settings 高级设置（可选）
 * @param preGeneratedTaskId 预生成的任务ID（可选）
 * @param sessionId Session ID（用于权限控制）
 * @returns 创建的任务记录
 */
export const createConversionTask = async (
  file: File,
  settings?: AdvancedSettings,
  preGeneratedTaskId?: string,
  sessionId?: string
): Promise<TaskRecord> => {
  console.log(`[TaskManager] ⚙️ 高级设置:`, JSON.stringify(settings, null, 2));
  
  // 1. 生成任务ID和文件路径
  const id = preGeneratedTaskId || randomUUID();
  const originalFilename = file.name || `upload-${id}.mkv`;
  const uploadDir = join(process.cwd(), UPLOAD_DIR);
  const taskDir = join(process.cwd(), TASK_DIR);
  const uploadPath = join(uploadDir, `${id}.mkv`);

  console.log(`[TaskManager] 🆔 任务ID: ${id}`);
  console.log(`[TaskManager] 📁 上传目录: ${uploadDir}`);
  console.log(`[TaskManager] 📁 任务目录: ${taskDir}`);

  // 2. 确保目录存在
  await ensureDir(uploadDir);
  await ensureDir(taskDir);

  // 3. 保存上传文件
  console.log(`[TaskManager] 💾 保存文件到: ${uploadPath}`);
  const buffer = await fileToBuffer(file);
  await writeFile(uploadPath, buffer);
  console.log(`[TaskManager] ✅ 文件保存成功，大小: ${buffer.length} 字节`);

  // 4. 创建任务记录（包含设置和 Session）
  console.log(`[TaskManager] 📝 创建任务记录`);
  const task = await taskStore.create({ 
    id, 
    originalFilename,
    settings,
    sessionId  // ✅ Session ID
  });
  console.log(`[TaskManager] ✅ 任务记录创建成功`);

  // 5. 异步调度任务执行
  console.log(`[TaskManager] 🚀 异步调度任务执行`);
  void taskScheduler.schedule(task, uploadPath);

  return task;
};

/**
 * 获取任务信息
 * @param id 任务ID
 * @returns 任务记录或null
 */
export const getTask = async (id: string): Promise<TaskRecord | null> => {
  try {
    return await readTask(id);
  } catch {
    return null;
  }
};
