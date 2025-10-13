/**
 * FFmpeg 转换配置映射
 * 职责：集中管理编码器参数和质量映射
 */

import type { VideoQuality, AudioQuality } from '@/shared/advanced-settings';

/**
 * 视频质量到 CRF 值的映射
 * CRF (Constant Rate Factor): 恒定速率因子
 * - 值越小，质量越高，文件越大
 * - 0 = 无损，51 = 最差质量
 * - 推荐范围：18-28
 */
export const VIDEO_QUALITY_MAP: Record<VideoQuality, number> = {
  high: 18,    // 高质量（接近无损）
  medium: 23,  // 中等质量（推荐值，平衡质量和大小）
  low: 28,     // 低质量（高压缩率）
  original: 0, // 保持原始（不改变质量）
};

/**
 * 音频质量到比特率的映射
 * Bitrate: 音频比特率，单位 kbps
 * - 常见范围：64kbps-320kbps
 */
export const AUDIO_QUALITY_MAP: Record<AudioQuality, string> = {
  high: '256k',   // 高质量（接近 CD 品质）
  medium: '192k', // 中等质量（推荐值，大多数场景足够）
  low: '128k',    // 低质量（可接受的最低质量）
  original: '',   // 保持原始（不设置比特率）
};

/**
 * 视频分辨率到高度的映射
 */
export const VIDEO_RESOLUTION_MAP = {
  '2160p': 2160, // 4K
  '1080p': 1080, // Full HD
  '720p': 720,   // HD
  '480p': 480,   // SD
  '360p': 360,   // 低分辨率
  original: 0,   // 保持原始
} as const;

/**
 * 视频帧率映射
 */
export const VIDEO_FRAMERATE_MAP = {
  '24': 24,  // 电影标准
  '30': 30,  // 视频标准
  '60': 60,  // 高帧率
  original: 0, // 保持原始
} as const;

/**
 * 音频声道映射
 */
export const AUDIO_CHANNELS_MAP = {
  stereo: 2, // 立体声
  mono: 1,   // 单声道
  original: 0, // 保持原始
} as const;

/**
 * 视频编码器映射
 */
export const VIDEO_ENCODER_MAP = {
  h264: 'libx264',
  h265: 'libx265',
  copy: 'copy',
} as const;

/**
 * 音频编码器映射
 */
export const AUDIO_ENCODER_MAP = {
  aac: 'aac',
  mp3: 'libmp3lame',
  copy: 'copy',
} as const;

/**
 * FFmpeg 编码预设
 * - ultrafast: 极快，压缩率最低
 * - superfast: 超快
 * - veryfast: 很快
 * - faster: 较快
 * - fast: 快
 * - medium: 中等（默认，平衡速度和压缩率）
 * - slow: 慢，压缩率更高
 * - slower: 较慢
 * - veryslow: 很慢，压缩率最高
 */
export const DEFAULT_PRESET = 'medium';

/**
 * FFmpeg 字幕编码器
 */
export const SUBTITLE_ENCODER = 'mov_text';
