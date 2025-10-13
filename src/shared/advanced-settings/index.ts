/**
 * 高级转换设置共享模块（统一导出）
 * 供前端和后端共同使用，避免跨层依赖
 */

// 导出类型
export type {
  // 视频
  VideoEncoder,
  VideoQuality,
  VideoResolution,
  VideoFrameRate,
  VideoSettings,
  // 音频
  AudioEncoder,
  AudioQuality,
  AudioChannels,
  AudioSettings,
  // 字幕
  SubtitleMode,
  SubtitleLanguage,
  SubtitleSettings,
  // 完整设置
  AdvancedSettings,
} from './types';

// 导出默认值和标签
export {
  DEFAULT_ADVANCED_SETTINGS,
  VIDEO_ENCODER_LABELS,
  VIDEO_QUALITY_LABELS,
  VIDEO_RESOLUTION_LABELS,
  VIDEO_FRAMERATE_LABELS,
  AUDIO_ENCODER_LABELS,
  AUDIO_QUALITY_LABELS,
  AUDIO_CHANNELS_LABELS,
  SUBTITLE_MODE_LABELS,
  SUBTITLE_LANGUAGE_LABELS,
} from './defaults';
