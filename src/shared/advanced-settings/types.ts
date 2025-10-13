/**
 * 高级转换设置类型定义（共享模块）
 * 用于前端和后端共享类型，避免跨层依赖
 */

// ==================== 视频设置 ====================
export type VideoEncoder = 'copy' | 'h264' | 'h265';
export type VideoQuality = 'original' | 'high' | 'medium' | 'low';
export type VideoResolution = 'original' | '2160p' | '1080p' | '720p' | '480p' | '360p';
export type VideoFrameRate = 'original' | '60' | '30' | '24';

export interface VideoSettings {
  encoder: VideoEncoder;
  quality: VideoQuality;
  resolution: VideoResolution;
  frameRate: VideoFrameRate;
}

// ==================== 音频设置 ====================
export type AudioEncoder = 'copy' | 'aac' | 'mp3';
export type AudioQuality = 'original' | 'high' | 'medium' | 'low';
export type AudioChannels = 'original' | 'stereo' | 'mono';

export interface AudioSettings {
  encoder: AudioEncoder;
  quality: AudioQuality;
  channels: AudioChannels;
}

// ==================== 字幕设置 ====================
export type SubtitleMode = 'keep' | 'burn' | 'remove' | 'external' | 'external-soft';
export type SubtitleLanguage = 'und' | 'chi' | 'eng' | 'jpn' | 'kor' | 'fre' | 'ger' | 'spa';

export interface SubtitleSettings {
  mode: SubtitleMode;
  trackIndex?: number;
  language?: SubtitleLanguage;           // ✅ P2-1: 字幕语言代码
  externalFile?: File | null;           // 前端使用：用户选择的文件对象
  externalFilePath?: string;             // 后端使用：服务器保存的文件路径
}

// ==================== 完整设置 ====================
export interface AdvancedSettings {
  video: VideoSettings;
  audio: AudioSettings;
  subtitle: SubtitleSettings;
}
