/**
 * ✅ P1 架构优化：重新导出共享模块
 * 
 * 此文件保留用于向后兼容，所有类型和常量现在从共享模块导入
 * 服务端代码应直接使用 @/shared/advanced-settings
 */

// 重新导出所有类型和常量
export type {
  VideoEncoder,
  VideoQuality,
  VideoResolution,
  VideoFrameRate,
  VideoSettings,
  AudioEncoder,
  AudioQuality,
  AudioChannels,
  AudioSettings,
  SubtitleMode,
  SubtitleLanguage,  // ✅ P2-1: 新增
  SubtitleSettings,
  AdvancedSettings,
} from '@/shared/advanced-settings';

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
  SUBTITLE_LANGUAGE_LABELS,  // ✅ P2-1: 新增
} from '@/shared/advanced-settings';
