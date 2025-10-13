/**
 * 任务存储适配器
 * 职责：将现有的 task-store 适配到 ITaskStore 接口
 * 遵循接口隔离原则（ISP）和依赖倒置原则（DIP）
 */

import { createTask, readTask, updateTask } from './task-store';
import type { ITaskStore } from './interfaces';
import type { CreateTaskInput, TaskRecord, UpdateTaskInput } from './types';

/**
 * 任务存储服务实现
 */
export class TaskStoreAdapter implements ITaskStore {
  async create(input: CreateTaskInput): Promise<TaskRecord> {
    return await createTask(input);
  }

  async read(id: string): Promise<TaskRecord> {
    return await readTask(id);
  }

  async update(id: string, update: UpdateTaskInput): Promise<TaskRecord> {
    return await updateTask(id, update);
  }
}

/**
 * 导出单例实例
 */
export const taskStore = new TaskStoreAdapter();
