/**
 * 字幕参数构建器
 * 职责：根据高级设置构建 FFmpeg 字幕相关参数
 */

import type { AdvancedSettings } from '@/shared/advanced-settings';
import { logger } from './ffmpeg-logger';
import { SUBTITLE_ENCODER } from './config';

/**
 * 根据高级设置构建字幕参数
 * 
 * @param settings 高级设置
 * @returns FFmpeg 字幕参数数组
 */
export const buildSubtitleArgs = (settings?: AdvancedSettings): string[] => {
  const args: string[] = [];
  
  if (!settings || settings.subtitle.mode === 'keep') {
    // 保留字幕（转换为MP4兼容格式）
    args.push('-c:s', SUBTITLE_ENCODER);
    
    // 轨道选择逻辑
    if (settings?.subtitle.trackIndex !== undefined && settings.subtitle.trackIndex >= 0) {
      const ffmpegTrackIndex = settings.subtitle.trackIndex;
      args.push('-map', '0:v', '-map', '0:a?', '-map', `0:s:${ffmpegTrackIndex}`);
      logger.subtitle(`保留字幕，选择轨道 ${settings.subtitle.trackIndex} (FFmpeg索引: ${ffmpegTrackIndex})`);
    } else {
      logger.subtitle('保留字幕（自动选择轨道）');
    }
  } else if (settings.subtitle.mode === 'burn') {
    // 硬字幕（烧录到视频，在视频滤镜中处理）
    args.push('-sn');
    
    if (settings.subtitle.trackIndex !== undefined && settings.subtitle.trackIndex >= 0) {
      logger.subtitle(`硬字幕模式，选择轨道 ${settings.subtitle.trackIndex}`);
    } else {
      logger.subtitle('硬字幕模式（自动选择轨道）');
    }
  } else if (settings.subtitle.mode === 'remove') {
    // 移除所有字幕
    args.push('-sn');
    logger.subtitle('移除所有字幕');
  } else if (settings.subtitle.mode === 'external') {
    // 外挂字幕烧录
    args.push('-sn');
    logger.subtitle('使用外挂字幕文件烧录（将在主函数中处理）');
  }
  
  return args;
};
