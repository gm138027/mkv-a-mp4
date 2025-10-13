/**
 * FFmpeg 日志工具
 * 职责：提供统一的 FFmpeg 相关日志格式
 */

interface LogEmoji {
  info: string;
  success: string;
  warning: string;
  error: string;
  debug: string;
}

const LOG_EMOJI: LogEmoji = {
  info: '🔍',
  success: '✅',
  warning: '⚠️',
  error: '❌',
  debug: '🐛',
};

/**
 * FFmpeg 日志类
 */
export class FFmpegLogger {
  private readonly prefix = '[FFmpeg]';

  /**
   * 记录信息日志
   */
  info(message: string, ...args: unknown[]): void {
    console.log(`${this.prefix} ${LOG_EMOJI.info} ${message}`, ...args);
  }

  /**
   * 记录成功日志
   */
  success(message: string, ...args: unknown[]): void {
    console.log(`${this.prefix} ${LOG_EMOJI.success} ${message}`, ...args);
  }

  /**
   * 记录警告日志
   */
  warn(message: string, ...args: unknown[]): void {
    console.warn(`${this.prefix} ${LOG_EMOJI.warning} ${message}`, ...args);
  }

  /**
   * 记录错误日志
   */
  error(message: string, ...args: unknown[]): void {
    console.error(`${this.prefix} ${LOG_EMOJI.error} ${message}`, ...args);
  }

  /**
   * 记录调试日志
   */
  debug(message: string, ...args: unknown[]): void {
    console.log(`${this.prefix} ${LOG_EMOJI.debug} ${message}`, ...args);
  }

  /**
   * 记录视频相关日志
   */
  video(message: string, ...args: unknown[]): void {
    console.log(`${this.prefix} 📹 ${message}`, ...args);
  }

  /**
   * 记录音频相关日志
   */
  audio(message: string, ...args: unknown[]): void {
    console.log(`${this.prefix} 🔊 ${message}`, ...args);
  }

  /**
   * 记录字幕相关日志
   */
  subtitle(message: string, ...args: unknown[]): void {
    console.log(`${this.prefix} 📝 ${message}`, ...args);
  }

  /**
   * 记录进度相关日志
   */
  progress(message: string, ...args: unknown[]): void {
    console.log(`${this.prefix} 📊 ${message}`, ...args);
  }

  /**
   * 记录质量相关日志
   */
  quality(message: string, ...args: unknown[]): void {
    console.log(`${this.prefix} 🎨 ${message}`, ...args);
  }

  /**
   * 记录预设相关日志
   */
  preset(message: string, ...args: unknown[]): void {
    console.log(`${this.prefix} ⚡ ${message}`, ...args);
  }

  /**
   * 记录分辨率相关日志
   */
  resolution(message: string, ...args: unknown[]): void {
    console.log(`${this.prefix} 📐 ${message}`, ...args);
  }

  /**
   * 记录帧率相关日志
   */
  framerate(message: string, ...args: unknown[]): void {
    console.log(`${this.prefix} 🎬 ${message}`, ...args);
  }

  /**
   * 记录文件相关日志
   */
  file(message: string, ...args: unknown[]): void {
    console.log(`${this.prefix} 📁 ${message}`, ...args);
  }

  /**
   * 记录命令相关日志
   */
  command(message: string, ...args: unknown[]): void {
    console.log(`${this.prefix} ${message}`, ...args);
  }

  /**
   * 记录标准错误输出（stderr）
   */
  stderr(message: string, maxLength = 200): void {
    const truncated = message.length > maxLength ? message.substring(0, maxLength) : message;
    console.log(`${this.prefix} stderr: ${truncated}`);
  }
}

/**
 * 默认 FFmpeg 日志实例
 */
export const logger = new FFmpegLogger();
