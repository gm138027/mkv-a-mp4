import type { UploadState, VideoItem } from '@/app/state';

export const createVideoItem = (file: File, id: string): VideoItem => ({
  id,
  name: file.name,
  sizeMb: Number((file.size / 1024 / 1024).toFixed(2)),
  state: 'ready',
  message: undefined,
  progress: 0,
  downloadUrl: null,
});

export const mapStatusToPatch = (
  video: VideoItem,
  status: string,
  message?: string,
  downloadUrl?: string | null
): Partial<VideoItem> => {
  const next: Partial<VideoItem> = { message };

  const state = mapTaskStatus(status);
  next.state = state;

  if (state === 'completed' && downloadUrl) {
    next.downloadUrl = downloadUrl;
    next.progress = 100;
  }

  if (state === 'processing') {
    // 尝试从 message 中解析真实进度（格式：'45%'）
    if (message && message.endsWith('%')) {
      const progressValue = parseInt(message, 10);
      if (!isNaN(progressValue)) {
        next.progress = Math.min(100, Math.max(0, progressValue));
      }
    } else if (video.progress !== undefined) {
      // 如果没有真实进度，使用假进度（兜底）
      next.progress = Math.min(95, video.progress + 2);
    }
  }

  if (state === 'reading' && video.progress !== undefined && video.progress < 100) {
    // 读取文件状态保持进度
    next.progress = video.progress;
  }

  return next;
};

export const mapTaskStatus = (status: string): UploadState => {
  switch (status) {
    case 'queued':
      return 'reading';  // ✅ 队列中视为读取文件阶段
    case 'processing':
      return 'processing';
    case 'completed':
      return 'completed';
    case 'failed':
      return 'failed';
    default:
      return 'ready';
  }
};
