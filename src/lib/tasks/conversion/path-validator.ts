/**
 * 路径验证和转义工具
 * 职责：验证文件路径存在性，转义特殊字符用于 FFmpeg
 */

import { access } from 'fs/promises';

/**
 * 验证文件是否存在
 * 
 * @param filePath 文件路径
 * @throws 如果文件不存在则抛出错误
 */
export const validateFileExists = async (filePath: string): Promise<void> => {
  try {
    await access(filePath);
  } catch {
    throw new Error(`文件不存在: ${filePath}`);
  }
};

/**
 * 转义 FFmpeg 路径中的特殊字符
 * Windows 路径需要将反斜杠转为正斜杠，冒号需要转义
 * 
 * @param path 原始路径
 * @returns 转义后的路径
 * 
 * @example
 * escapeFFmpegPath('C:\\Users\\video.mkv')
 * // returns 'C:/Users/video.mkv'
 * 
 * escapeFFmpegPath('C:\\Users\\subtitle.srt')
 * // returns 'C\\:/Users/subtitle.srt' (用于 subtitles 滤镜)
 */
export const escapeFFmpegPath = (path: string): string => {
  return path
    .replace(/\\/g, '/')      // 反斜杠转正斜杠
    .replace(/:/g, '\\:');    // 冒号转义
};
