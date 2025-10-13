/**
 * 高级转换设置默认值和标签（共享模块）
 */

import type {
  AdvancedSettings,
  VideoEncoder,
  VideoQuality,
  VideoResolution,
  VideoFrameRate,
  AudioEncoder,
  AudioQuality,
  AudioChannels,
  SubtitleMode,
  SubtitleLanguage,
} from './types';

// ==================== 默认设置 ====================
export const DEFAULT_ADVANCED_SETTINGS: AdvancedSettings = {
  video: {
    encoder: 'copy',
    quality: 'original',
    resolution: 'original',
    frameRate: 'original',
  },
  audio: {
    encoder: 'copy',
    quality: 'original',
    channels: 'original',
  },
  subtitle: {
    mode: 'keep',
    trackIndex: 0,
    language: 'und',  // ✅ P2-1: 默认为"未指定"
    externalFile: null,
  },
};

// ==================== 视频标签 ====================
export const VIDEO_ENCODER_LABELS: Record<VideoEncoder, string> = {
  copy: '保持原始 (推荐)',
  h264: 'H.264 (重新编码)',
  h265: 'H.265 (HEVC)',
};

export const VIDEO_QUALITY_LABELS: Record<VideoQuality, string> = {
  original: '保持原始',
  high: '高质量 (CRF 18)',
  medium: '中等质量 (CRF 23)',
  low: '较低质量 (CRF 28)',
};

export const VIDEO_RESOLUTION_LABELS: Record<VideoResolution, string> = {
  original: '保持原始 (推荐)',
  '2160p': '4K (3840×2160)',
  '1080p': '1080p (1920×1080)',
  '720p': '720p (1280×720)',
  '480p': '480p (854×480)',
  '360p': '360p (640×360)',
};

export const VIDEO_FRAMERATE_LABELS: Record<VideoFrameRate, string> = {
  original: '保持原始 (推荐)',
  '60': '60 fps',
  '30': '30 fps',
  '24': '24 fps',
};

// ==================== 音频标签 ====================
export const AUDIO_ENCODER_LABELS: Record<AudioEncoder, string> = {
  copy: '保持原始 (推荐)',
  aac: 'AAC',
  mp3: 'MP3',
};

export const AUDIO_QUALITY_LABELS: Record<AudioQuality, string> = {
  original: '保持原始',
  high: '高质量 (320k)',
  medium: '中等质量 (192k)',
  low: '较低质量 (128k)',
};

export const AUDIO_CHANNELS_LABELS: Record<AudioChannels, string> = {
  original: '保持原始 (推荐)',
  stereo: '立体声',
  mono: '单声道',
};

// ==================== 字幕标签 ====================
export const SUBTITLE_MODE_LABELS: Record<SubtitleMode, string> = {
  keep: '保留软字幕 (推荐)',
  burn: '烧录硬字幕',
  remove: '删除字幕',
  external: '外挂字幕烧录',
  'external-soft': '外挂字幕导入',
};

export const SUBTITLE_LANGUAGE_LABELS: Record<SubtitleLanguage, string> = {
  und: '未指定 (推荐)',
  chi: '中文 (简体/繁体)',
  eng: '英语',
  jpn: '日语',
  kor: '韩语',
  fre: '法语',
  ger: '德语',
  spa: '西班牙语',
};
