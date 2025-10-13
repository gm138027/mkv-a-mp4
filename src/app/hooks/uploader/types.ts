/**
 * 上传器相关类型定义
 */

export interface TaskResponse {
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  message?: string;
  outputFilename?: string;
}

export interface ActiveTask {
  taskId: string;
  videoId: string;
  file: File;
}

export const POLL_INTERVAL = 1500; // 1.5s 轮询间隔
export const MAX_404_RETRIES = 3; // 404 错误最大重试次数
