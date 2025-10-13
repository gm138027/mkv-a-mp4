/**
 * 音频参数构建器
 * 职责：根据高级设置构建 FFmpeg 音频相关参数
 */

import type { AdvancedSettings } from '@/shared/advanced-settings';
import { logger } from './ffmpeg-logger';
import { AUDIO_QUALITY_MAP, AUDIO_CHANNELS_MAP, AUDIO_ENCODER_MAP } from './config';

/**
 * 根据高级设置构建音频参数
 * 
 * @param settings 高级设置
 * @returns FFmpeg 音频参数数组
 */
export const buildAudioArgs = (settings?: AdvancedSettings): string[] => {
  const args: string[] = [];
  
  if (!settings || settings.audio.encoder === 'copy') {
    args.push('-c:a', 'copy');
    logger.audio('保持原始（copy模式，极速转换）');
    return args;
  }
  
  // 设置编码器
  const encoderValue = AUDIO_ENCODER_MAP[settings.audio.encoder];
  if (encoderValue) {
    args.push('-c:a', encoderValue);
    logger.audio(`${settings.audio.encoder.toUpperCase()} 重新编码${settings.audio.encoder === 'aac' ? '（最通用）' : ''}`);
  }

  // 质量控制
  if (settings.audio.quality !== 'original') {
    const bitrate = AUDIO_QUALITY_MAP[settings.audio.quality];
    args.push('-b:a', bitrate);
    const label = settings.audio.quality === 'high' ? '高质量' : settings.audio.quality === 'medium' ? '中等质量（推荐）' : '低质量';
    logger.quality(`音频质量: ${label} (${bitrate}bps)`);
  } else {
    logger.quality('音频质量: 保持原始');
  }

  // 声道控制
  if (settings.audio.channels !== 'original') {
    const channels = AUDIO_CHANNELS_MAP[settings.audio.channels];
    if (channels > 0) {
      args.push('-ac', channels.toString());
      const label = channels === 2 ? '立体声 (2.0)' : '单声道 (1.0)';
      logger.audio(`声道: ${label}`);
    }
  } else {
    logger.audio('声道: 保持原始');
  }
  
  return args;
};
