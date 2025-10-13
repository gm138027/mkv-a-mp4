import { initializeCleanupScheduler } from './tasks/scheduler';
import { initializeStorageDirs } from './fs-utils';

/**
 * 应用初始化函数
 * 在应用启动时调用，初始化各种服务
 */
export const initializeApp = () => {
  console.log('正在初始化应用服务...');
  
  // 1. 初始化存储目录（同步，必须在其他服务之前完成）
  initializeStorageDirs();
  
  // 2. 初始化清理调度器
  initializeCleanupScheduler();
  
  console.log('应用服务初始化完成');
};

// 如果在服务器环境中，立即初始化
if (typeof window === 'undefined') {
  try {
    initializeApp();
  } catch (error) {
    console.error('应用初始化失败:', error);
    process.exit(1);
  }
}
