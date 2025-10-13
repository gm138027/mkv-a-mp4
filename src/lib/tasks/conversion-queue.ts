/**
 * 转换队列管理器
 * 职责：控制并发转换数量，避免服务器过载
 * 遵循单一职责原则（SRP）
 */

import PQueue from 'p-queue';

/**
 * 全局转换队列
 * 并发数设置为 2：平衡速度和服务器稳定性
 */
const conversionQueue = new PQueue({
  concurrency: 2, // 最多同时转换 2 个文件
  autoStart: true,
});

/**
 * 获取队列实例
 */
export const getConversionQueue = (): PQueue => {
  return conversionQueue;
};

/**
 * 获取队列状态
 */
export const getQueueStatus = () => {
  return {
    pending: conversionQueue.pending,
    size: conversionQueue.size,
    isPaused: conversionQueue.isPaused,
  };
};

