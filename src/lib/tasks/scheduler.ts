import { cleanupExpiredTasks } from './cleanup';
import { CLEANUP_INTERVAL_MINUTES } from '@/lib/config';

/**
 * 定时清理服务类
 */
class CleanupScheduler {
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;

  /**
   * 启动定时清理服务
   */
  start() {
    if (this.isRunning) {
      console.log('清理调度器已在运行');
      return;
    }

    console.log(`启动清理调度器，间隔: ${CLEANUP_INTERVAL_MINUTES} 分钟`);
    this.isRunning = true;

    // 立即执行一次清理
    this.runCleanup();

    // 设置定时任务
    this.intervalId = setInterval(() => {
      this.runCleanup();
    }, CLEANUP_INTERVAL_MINUTES * 60 * 1000);
  }

  /**
   * 停止定时清理服务
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('清理调度器已停止');
  }

  /**
   * 执行清理任务
   */
  private async runCleanup() {
    try {
      console.log('开始执行定时清理任务...');
      await cleanupExpiredTasks();
    } catch (error) {
      console.error('定时清理任务执行失败:', error);
    }
  }

  /**
   * 获取调度器状态
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      intervalMinutes: CLEANUP_INTERVAL_MINUTES,
    };
  }
}

// 创建全局实例
export const cleanupScheduler = new CleanupScheduler();

/**
 * 在应用启动时初始化清理调度器
 */
export const initializeCleanupScheduler = () => {
  // 只在生产环境或明确启用时启动
  const shouldStart = process.env.NODE_ENV === 'production' || 
                     process.env.ENABLE_CLEANUP_SCHEDULER === 'true';
  
  if (shouldStart) {
    cleanupScheduler.start();
    
    // 优雅关闭处理
    const gracefulShutdown = () => {
      console.log('正在关闭清理调度器...');
      cleanupScheduler.stop();
      process.exit(0);
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
  } else {
    console.log('清理调度器未启用 (设置 ENABLE_CLEANUP_SCHEDULER=true 启用)');
  }
};
