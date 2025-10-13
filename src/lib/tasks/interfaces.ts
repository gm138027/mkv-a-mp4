/**
 * 任务管理系统的接口定义
 * 遵循依赖倒置原则（DIP），定义抽象接口而非依赖具体实现
 */

import type { TaskRecord, CreateTaskInput, UpdateTaskInput } from './types';

/**
 * 任务存储接口
 * 负责任务记录的CRUD操作
 */
export interface ITaskStore {
  /**
   * 创建新任务
   * @param input 任务创建输入
   */
  create(input: CreateTaskInput): Promise<TaskRecord>;

  /**
   * 读取任务
   * @param id 任务ID
   */
  read(id: string): Promise<TaskRecord>;

  /**
   * 更新任务
   * @param id 任务ID
   * @param update 更新内容
   */
  update(id: string, update: UpdateTaskInput): Promise<TaskRecord>;
}

import type { AdvancedSettings } from '@/shared/advanced-settings';  // ✅ P1: 使用共享模块

/**
 * 转换服务接口
 * 负责视频格式转换
 */
export interface IConversionService {
  /**
   * 执行转换
   * @param inputPath 输入文件路径
   * @param taskId 任务ID
   * @param onProgress 进度回调函数（可选）
   * @param settings 高级设置（可选）✨ 新增
   */
  convert(inputPath: string, taskId: string, onProgress?: (progress: number) => void, settings?: AdvancedSettings): Promise<string>;
}

/**
 * 清理服务接口
 * 负责文件清理
 */
export interface ICleanupService {
  /**
   * 清理指定任务的文件
   * @param taskId 任务ID
   */
  cleanupTask(taskId: string): Promise<void>;

  /**
   * 延迟清理文件
   * @param filePath 文件路径
   * @param delayMs 延迟时间（毫秒）
   */
  scheduleCleanup(filePath: string, delayMs: number): void;
}

/**
 * 任务调度接口
 * 负责任务的执行调度
 */
export interface ITaskScheduler {
  /**
   * 调度任务执行
   * @param task 任务记录
   * @param uploadPath 上传文件路径
   */
  schedule(task: TaskRecord, uploadPath: string): Promise<void>;
}
