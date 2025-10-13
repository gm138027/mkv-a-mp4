/**
 * 生产环境日志控制
 * - 开发环境：输出所有日志
 * - 生产环境：只输出错误日志
 */

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export const logger = {
  /**
   * 信息日志（生产环境禁用）
   */
  log: (...args: unknown[]) => {
    if (!IS_PRODUCTION) {
      console.log(...args);
    }
  },

  /**
   * 警告日志（生产环境禁用）
   */
  warn: (...args: unknown[]) => {
    if (!IS_PRODUCTION) {
      console.warn(...args);
    }
  },

  /**
   * 错误日志（生产环境也输出，用于错误追踪）
   */
  error: (...args: unknown[]) => {
    console.error(...args);
  },

  /**
   * 调试日志（生产环境禁用）
   */
  debug: (...args: unknown[]) => {
    if (!IS_PRODUCTION) {
      console.log('[DEBUG]', ...args);
    }
  },
};

/**
 * 便捷导出
 */
export const { log, warn, error, debug } = logger;
