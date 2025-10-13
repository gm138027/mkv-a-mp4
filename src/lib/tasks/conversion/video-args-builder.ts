/**
 * 视频参数构建器
 * 职责：根据高级设置构建 FFmpeg 视频相关参数
 */

import type { AdvancedSettings } from '@/shared/advanced-settings';
import { escapeFFmpegPath } from './path-validator';
import { logger } from './ffmpeg-logger';
import {
  VIDEO_QUALITY_MAP,
  VIDEO_RESOLUTION_MAP,
  VIDEO_FRAMERATE_MAP,
  VIDEO_ENCODER_MAP,
  DEFAULT_PRESET,
} from './config';

/**
 * 根据高级设置构建视频参数
 * 
 * @param settings 高级设置
 * @param inputPath 输入视频路径（用于硬字幕烧录）
 * @returns FFmpeg 视频参数数组
 */
export const buildVideoArgs = (settings?: AdvancedSettings, inputPath?: string): string[] => {
  const args: string[] = [];
  
  const needBurnSubtitle = settings?.subtitle.mode === 'burn' || settings?.subtitle.mode === 'external';
  
  if (!settings || (settings.video.encoder === 'copy' && !needBurnSubtitle)) {
    args.push('-c:v', 'copy');
    logger.video('保持原始（copy模式，极速转换）');
    return args;
  }
  
  // 重新编码
  let encoder = settings.video.encoder;
  
  if (needBurnSubtitle && encoder === 'copy') {
    encoder = 'h264';
    logger.warn('硬字幕需要重新编码，自动切换为 H.264');
  }
  
  // 设置编码器
  const encoderValue = VIDEO_ENCODER_MAP[encoder];
  if (encoderValue && encoderValue !== 'copy') {
    args.push('-c:v', encoderValue);
    logger.video(`${encoder.toUpperCase()} 重新编码`);
  }

  // 质量控制
  if (settings.video.quality !== 'original') {
    const crf = VIDEO_QUALITY_MAP[settings.video.quality];
    args.push('-crf', crf.toString());
    logger.quality(`${settings.video.quality === 'high' ? '高质量' : settings.video.quality === 'medium' ? '中等质量（推荐）' : '低质量（高压缩）'} (CRF ${crf})`);
  } else {
    logger.quality('保持原始');
  }

  // 编码预设
  if (encoder === 'h264' || encoder === 'h265') {
    args.push('-preset', DEFAULT_PRESET);
    logger.preset(`${DEFAULT_PRESET} (平衡速度与压缩)`);
  }

  // 收集视频滤镜
  const filters: string[] = [];
  
  // 分辨率控制
  if (settings.video.resolution !== 'original') {
    const height = VIDEO_RESOLUTION_MAP[settings.video.resolution];
    if (height > 0) {
      filters.push(`scale=-2:${height}`);
      logger.resolution(`${settings.video.resolution} (高度${height}，保持宽高比)`);
    }
  } else {
    logger.resolution('保持原始');
  }
  
  // 硬字幕滤镜
  if (settings?.subtitle.mode === 'burn' && inputPath) {
    const escapedPath = escapeFFmpegPath(inputPath);
    const ffmpegTrackIndex = settings?.subtitle.trackIndex ?? 0;
    filters.push(`subtitles='${escapedPath}':si=${ffmpegTrackIndex}`);
    logger.subtitle(`内置字幕: 烧录轨道 ${settings?.subtitle.trackIndex} (FFmpeg索引: ${ffmpegTrackIndex}) 的字幕到视频`);
  } else if (settings?.subtitle.mode === 'external' && settings.subtitle.externalFilePath) {
    const escapedSubtitlePath = escapeFFmpegPath(settings.subtitle.externalFilePath);
    filters.push(`subtitles='${escapedSubtitlePath}':charenc=UTF-8`);
    logger.subtitle('外挂字幕: 烧录外部字幕文件到视频');
  }
  
  // 如果有滤镜，组合成 -vf 参数
  if (filters.length > 0) {
    args.push('-vf', filters.join(','));
  }

  // 帧率控制
  if (settings.video.frameRate !== 'original') {
    const fps = VIDEO_FRAMERATE_MAP[settings.video.frameRate];
    if (fps > 0) {
      args.push('-r', fps.toString());
      const label = fps === 24 ? '电影标准' : fps === 30 ? '视频标准' : '高帧率';
      logger.framerate(`${fps}fps (${label})`);
    }
  } else {
    logger.framerate('保持原始');
  }
  
  return args;
};
