/**
 * 视频转换主入口
 * 职责：协调视频转换流程，整合各个子模块
 */

import { spawn } from 'child_process';
import { join } from 'path';
import { OUTPUT_DIR } from '@/lib/config';
import { ensureDir } from '@/lib/fs-utils';
import type { AdvancedSettings } from '@/shared/advanced-settings';
import { analyzeFfmpegError, extractErrorDetails } from '../ffmpeg-errors';
import { hasSubtitles } from '../subtitle-probe';
import { parseDuration, parseTime, calculateProgress } from './progress-parser';
import { validateFileExists } from './path-validator';
import { buildVideoArgs } from './video-args-builder';
import { buildAudioArgs } from './audio-args-builder';
import { buildSubtitleArgs } from './subtitle-args-builder';
import { logger } from './ffmpeg-logger';

export interface ConversionOptions {
  inputPath: string;
  taskId: string;
  onProgress?: (progress: number) => void;
  settings?: AdvancedSettings;
}

/**
 * 将 MKV 视频转换为 MP4 格式
 * 
 * @param options 转换选项
 * @returns 输出文件路径
 */
export const convertToMp4 = async ({ inputPath, taskId, onProgress, settings }: ConversionOptions): Promise<string> => {
  const outputDir = join(process.cwd(), OUTPUT_DIR);
  await ensureDir(outputDir);
  const outputPath = join(outputDir, `${taskId}.mp4`);

  // ✅ P1修复：深拷贝 settings，避免修改原始对象
  const workingSettings = settings ? JSON.parse(JSON.stringify(settings)) as AdvancedSettings : undefined;

  // 处理外挂字幕文件
  let externalSubtitlePath: string | undefined;
  logger.debug(`字幕模式 = ${workingSettings?.subtitle.mode}`);
  
  if (workingSettings?.subtitle.mode === 'external' || workingSettings?.subtitle.mode === 'external-soft') {
    if (!workingSettings?.subtitle.externalFilePath) {
      throw new Error('外挂字幕模式需要提供字幕文件路径');
    }
    
    externalSubtitlePath = workingSettings.subtitle.externalFilePath;
    logger.file(`外挂字幕: 使用文件路径 ${externalSubtitlePath}`);
    
    // ✅ 兜底保障：检查字幕文件是否存在
    try {
      await validateFileExists(externalSubtitlePath);
      logger.success('外挂字幕文件存在');
    } catch {
      // ✅ 字幕文件不存在，自动降级为移除字幕模式
      logger.warn(`⚠️ 外挂字幕文件不存在: ${externalSubtitlePath}`);
      logger.warn('⚠️ 自动降级为"移除字幕"模式，转换将继续');
      workingSettings.subtitle.mode = 'remove';
      externalSubtitlePath = undefined;
    }
  }

  // 字幕探测与自动降级
  if (workingSettings && (workingSettings.subtitle.mode === 'burn' || workingSettings.subtitle.mode === 'keep')) {
    logger.info(`检测视频字幕流（当前模式: ${workingSettings.subtitle.mode}）...`);
    const videoHasSubtitles = await hasSubtitles(inputPath);
    
    if (!videoHasSubtitles) {
      logger.warn(`视频不包含字幕流，"${workingSettings.subtitle.mode}" 模式已自动降级为 "remove"`);
      logger.warn('提示：如需添加字幕，请使用"外挂字幕"功能');
      workingSettings.subtitle.mode = 'remove'; // ✅ 现在修改的是副本
    } else {
      logger.success(`视频包含字幕流，继续使用 "${workingSettings.subtitle.mode}" 模式`);
    }
  }

  // 构建 FFmpeg 命令
  const command = 'ffmpeg';
  const args = ['-y', '-i', inputPath];

  // 添加外挂字幕输入（作为 Input #1）
  if (workingSettings?.subtitle.mode === 'external-soft' && externalSubtitlePath) {
    await validateFileExists(externalSubtitlePath);
    args.push('-i', externalSubtitlePath);
    logger.file(`外挂字幕: 添加字幕文件输入 "${externalSubtitlePath}"`);
  }

  // 添加视频和音频参数
  args.push(...buildVideoArgs(workingSettings, inputPath), ...buildAudioArgs(workingSettings));

  // 处理字幕参数
  if (workingSettings?.subtitle.mode === 'external-soft') {
    args.push('-map', '0:v', '-map', '0:a?', '-map', '1:0');
    args.push('-c:s', 'mov_text');
    
    const language = workingSettings.subtitle.language || 'und';
    args.push('-metadata:s:s:0', `language=${language}`);
    logger.subtitle(`外挂字幕软字幕导入 (映射 Input #1 的字幕流，语言: ${language})`);
  } else {
    args.push(...buildSubtitleArgs(workingSettings));
  }

  args.push(outputPath);

  logger.command('完整命令:', command, args.join(' '));

  // 执行 FFmpeg 转换
  await executeFFmpeg(command, args, onProgress);

  return outputPath;
};

/**
 * 执行 FFmpeg 进程
 * 
 * @param command FFmpeg 命令
 * @param args FFmpeg 参数
 * @param onProgress 进度回调
 */
const executeFFmpeg = async (
  command: string,
  args: string[],
  onProgress?: (progress: number) => void
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let duration: number | null = null;
    let stderrBuffer = '';

    child.stderr?.on('data', (data: Buffer) => {
      const output = data.toString();
      stderrBuffer += output;

      logger.stderr(output);

      // 解析总时长
      if (duration === null) {
        duration = parseDuration(stderrBuffer);
        if (duration) {
          logger.success(`检测到视频总时长: ${duration.toFixed(2)}秒`);
        }
      }

      // 解析当前进度
      if (duration && onProgress) {
        const currentTime = parseTime(stderrBuffer);
        if (currentTime !== null) {
          const progress = calculateProgress(currentTime, duration);
          logger.progress(`${currentTime.toFixed(2)}s / ${duration.toFixed(2)}s = ${progress}%`);
          onProgress(progress);
        }
      }
    });

    child.on('error', (error) => {
      logger.error('错误:', error);
      reject(error);
    });

    child.on('close', (code) => {
      logger.info(`进程结束，退出码: ${code}`);
      if (code === 0) {
        if (onProgress) {
          logger.success('转换完成，设置进度为 100%');
          onProgress(100);
        }
        resolve();
      } else {
        const exitCode = code ?? 1;
        const friendlyMessage = analyzeFfmpegError(exitCode, stderrBuffer);
        const errorDetails = extractErrorDetails(stderrBuffer);
        
        logger.error('转换失败:');
        logger.error(`用户提示: ${friendlyMessage}`);
        logger.error(`错误详情:\n${errorDetails}`);
        
        reject(new Error(friendlyMessage));
      }
    });
  });
};
