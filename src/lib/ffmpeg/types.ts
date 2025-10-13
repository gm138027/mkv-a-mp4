/**
 * FFmpeg.wasm 类型定义
 */

/**
 * 转换状态
 */
export type ConversionStatus = 
  | 'idle'       // 空闲
  | 'loading'    // 加载 FFmpeg
  | 'reading'    // 读取文件
  | 'converting' // 转换中
  | 'completed'  // 完成
  | 'failed';    // 失败

/**
 * 视频任务
 */
export interface VideoTask {
  /** 任务 ID */
  id: string;
  
  /** 输入文件 */
  file: File;
  
  /** 状态 */
  status: ConversionStatus;
  
  /** 进度 (0-100) */
  progress: number;
  
  /** 输出 Blob（转换完成后） */
  outputBlob?: Blob;
  
  /** 错误信息 */
  error?: string;
  
  /** 日志信息 */
  logs: string[];
  
  /** 创建时间 */
  createdAt: number;
  
  /** 完成时间 */
  completedAt?: number;
}

/**
 * 转换配置
 */
export interface ConversionConfig {
  /** 视频编码器 */
  videoCodec: 'copy' | 'libx264' | 'libx265';
  
  /** 音频编码器 */
  audioCodec: 'copy' | 'aac' | 'mp3';
  
  /** 视频质量 */
  quality: 'original' | 'high' | 'medium' | 'low';
  
  /** 分辨率 */
  resolution: 'original' | '2160p' | '1080p' | '720p' | '480p' | '360p';
  
  /** 帧率 */
  frameRate: 'original' | '60' | '30' | '24';
  
  /** 音频质量 */
  audioQuality: 'original' | 'high' | 'medium' | 'low';
}

/**
 * 默认配置（最快模式：直接复制）
 */
export const DEFAULT_CONFIG: ConversionConfig = {
  videoCodec: 'copy',
  audioCodec: 'copy',
  quality: 'original',
  resolution: 'original',
  frameRate: 'original',
  audioQuality: 'original',
};
