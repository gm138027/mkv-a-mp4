/**
 * 任务调度器
 * 职责：协调任务的执行流程（转换、清理、状态更新）
 * 遵循单一职责原则（SRP）和依赖倒置原则（DIP）
 */

import { join } from 'path';
import { DEFAULT_EXPIRY_HOURS, OUTPUT_DIR } from '@/lib/config';
import { getConversionQueue } from './conversion-queue';
import type { ITaskScheduler, ITaskStore, IConversionService, ICleanupService } from './interfaces';
import type { TaskRecord } from './types';

/**
 * 工具函数：计算未来时间
 */
const hoursFromNow = (hours: number): string => {
  return new Date(Date.now() + hours * 3600 * 1000).toISOString();
};

/**
 * 任务调度器实现
 */
export class TaskScheduler implements ITaskScheduler {
  constructor(
    private taskStore: ITaskStore,
    private conversionService: IConversionService,
    private cleanupService: ICleanupService
  ) {}

  /**
   * 调度任务执行
   * 使用队列控制并发数
   */
  async schedule(task: TaskRecord, uploadPath: string): Promise<void> {
    console.log(`[TaskScheduler] 🚀 开始调度任务: ${task.id}`);
    console.log(`[TaskScheduler] 📁 上传文件路径: ${uploadPath}`);

    // 先更新为排队状态
    await this.taskStore.update(task.id, { status: 'queued', message: '等待转换...' });

    // 加入队列
    const queue = getConversionQueue();
    console.log(`[TaskScheduler] 📋 加入转换队列 (当前队列: ${queue.size}, 正在处理: ${queue.pending})`);

    // 使用队列执行转换任务
    void queue.add(async () => {
      await this.executeConversion(task, uploadPath);
    });
  }

  /**
   * 执行转换任务
   * 遵循单一职责原则：只负责转换逻辑
   */
  private async executeConversion(task: TaskRecord, uploadPath: string): Promise<void> {
    console.log(`[TaskScheduler] 🎬 开始执行转换任务: ${task.id}`);

    try {
      // 1. 更新任务状态为处理中
      console.log(`[TaskScheduler] 📝 更新任务状态为 processing`);
      await this.taskStore.update(task.id, { status: 'processing', message: '0%' });

      // 2. 执行转换（带进度回调和设置）✨
      console.log(`[TaskScheduler] 🎬 开始执行转换...`);
      if (task.settings) {
        console.log(`[TaskScheduler] ⚙️ 使用高级设置:`, JSON.stringify(task.settings));
      }
      let lastProgress = 0;
      let lastUpdateTime = 0;
      await this.conversionService.convert(uploadPath, task.id, (progress: number) => {
        console.log(`[TaskScheduler] 📊 收到进度回调: ${progress}%`);
        const now = Date.now();
        // 更新策略（已优化：减少 60% 写入次数，进度条仍然流畅）：
        // 1. 进度变化 >= 5%，或
        // 2. 距离上次更新超过 500ms，或
        // 3. 进度 >= 95%（接近完成）
        const shouldUpdate =
          progress - lastProgress >= 5 ||
          now - lastUpdateTime >= 500 ||
          progress >= 95;

        if (shouldUpdate) {
          lastProgress = progress;
          lastUpdateTime = now;
          console.log(`[TaskScheduler] 💾 更新任务进度: ${progress}%`);
          // 使用非阻塞更新（不等待完成）
          this.taskStore.update(task.id, {
            status: 'processing',
            message: `${progress}%`
          }).catch(err => {
            console.error(`更新进度失败 ${task.id}:`, err);
          });
        }
      }, task.settings);  // ✨ 传递设置到转换服务

      console.log(`[TaskScheduler] ✅ 转换完成`);


      // 3. 更新任务状态为完成
      const relativeOutput = join(OUTPUT_DIR, `${task.id}.mp4`);
      await this.taskStore.update(task.id, {
        status: 'completed',
        outputFilename: relativeOutput,
        message: '100%',
        expiresAt: hoursFromNow(DEFAULT_EXPIRY_HOURS),
      });

      // 4. 延迟清理上传文件（5分钟后）
      this.cleanupService.scheduleCleanup(uploadPath, 5 * 60 * 1000);

    } catch (error) {
      // 处理失败情况
      await this.handleFailure(task.id, error);

      // 延迟清理所有文件（1小时后）
      setTimeout(async () => {
        try {
          await this.cleanupService.cleanupTask(task.id);
          console.log(`已清理失败任务: ${task.id}`);
        } catch (cleanupError) {
          console.error(`清理失败任务出错 ${task.id}:`, cleanupError);
        }
      }, 60 * 60 * 1000);
    }
  }

  /**
   * 处理任务失败
   */
  private async handleFailure(taskId: string, error: unknown): Promise<void> {
    const message = error instanceof Error ? error.message : 'Unknown error';
    await this.taskStore.update(taskId, {
      status: 'failed',
      message,
      expiresAt: hoursFromNow(24), // 失败任务24小时后过期
    });
  }
}
