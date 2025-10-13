/**
 * 清理服务
 * 职责：处理文件清理和延迟清理调度
 * 遵循单一职责原则（SRP）
 */

import { unlink } from 'fs/promises';
import { cleanupTask } from './cleanup';
import type { ICleanupService } from './interfaces';

/**
 * 清理服务实现
 */
export class CleanupService implements ICleanupService {
  /**
   * 清理指定任务的所有文件
   */
  async cleanupTask(taskId: string): Promise<void> {
    await cleanupTask(taskId);
  }

  /**
   * 延迟清理指定文件
   * @param filePath 文件路径
   * @param delayMs 延迟时间（毫秒）
   */
  scheduleCleanup(filePath: string, delayMs: number): void {
    setTimeout(async () => {
      try {
        await unlink(filePath);
        console.log(`已清理文件: ${filePath}`);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
          console.error(`清理文件失败 ${filePath}:`, error);
        }
      }
    }, delayMs);
  }
}

/**
 * 导出单例实例
 */
export const cleanupService = new CleanupService();
