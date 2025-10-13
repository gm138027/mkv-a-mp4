/**
 * FFmpeg 错误码映射和分析模块
 * 
 * 提供友好的错误提示，帮助用户快速定位问题
 */

// ==================== 错误码映射表 ====================

/**
 * FFmpeg 常见退出码及其含义
 * 参考：https://ffmpeg.org/ffmpeg.html#toc-Generic-options
 */
export const FFMPEG_ERROR_CODES: Record<number, string> = {
  1: '通用错误：请检查输入文件或命令参数',
  2: '无效参数：FFmpeg 命令参数配置错误',
  126: 'FFmpeg 无法执行：权限不足或文件损坏',
  127: 'FFmpeg 未安装：请先安装 FFmpeg',
  137: '内存不足：请尝试降低视频质量或分辨率',
  139: '段错误：视频编解码器不支持或文件损坏',
};

// ==================== 错误关键词映射 ====================

/**
 * 根据 stderr 输出内容识别具体错误
 */
export interface ErrorPattern {
  pattern: RegExp | string;
  message: string;
}

export const FFMPEG_ERROR_PATTERNS: ErrorPattern[] = [
  // 文件相关
  {
    pattern: /No such file or directory/i,
    message: '文件不存在：请检查输入文件或字幕文件路径',
  },
  {
    pattern: /Permission denied/i,
    message: '权限不足：无法读取输入文件或写入输出文件',
  },
  {
    pattern: /Invalid data found/i,
    message: '文件损坏：输入文件可能已损坏或格式不正确',
  },
  
  // 编解码器相关
  {
    pattern: /Unknown encoder/i,
    message: '编码器不支持：请选择其他视频编码格式',
  },
  {
    pattern: /Codec.*not found/i,
    message: '编解码器缺失：当前 FFmpeg 版本不支持此编解码器',
  },
  {
    pattern: /Encoder.*not found/i,
    message: '编码器缺失：请检查 FFmpeg 安装或选择其他编码格式',
  },
  
  // 字幕相关
  {
    pattern: /Subtitle encoding currently only possible from text to text/i,
    message: '字幕格式不支持：仅支持文本字幕格式（SRT、ASS、VTT）',
  },
  {
    pattern: /Error opening subtitle file/i,
    message: '字幕文件错误：无法打开字幕文件，请检查文件格式',
  },
  {
    pattern: /Invalid UTF-8/i,
    message: '字幕编码错误：字幕文件编码格式不正确，请使用 UTF-8 编码',
  },
  
  // 流映射相关
  {
    pattern: /Output file #0 does not contain any stream/i,
    message: '流映射失败：输入文件可能不包含有效的视频或音频流',
  },
  {
    pattern: /Stream map.*matches no streams/i,
    message: '流映射错误：指定的轨道不存在，请重新选择字幕轨道',
  },
  
  // 磁盘空间相关
  {
    pattern: /No space left on device/i,
    message: '磁盘空间不足：请清理磁盘后重试',
  },
  
  // 其他常见错误
  {
    pattern: /Conversion failed/i,
    message: '转换失败：请检查输入文件格式或选择其他设置',
  },
  {
    pattern: /Unsupported codec/i,
    message: '编解码器不支持：请选择其他编码格式或更新 FFmpeg',
  },
];

// ==================== 错误分析函数 ====================

/**
 * 分析 FFmpeg 错误，返回友好的错误消息
 * 
 * @param exitCode FFmpeg 退出码
 * @param stderr FFmpeg stderr 输出内容
 * @returns 友好的错误消息
 */
export function analyzeFfmpegError(exitCode: number, stderr: string): string {
  // 1. 优先根据 stderr 内容分析
  for (const { pattern, message } of FFMPEG_ERROR_PATTERNS) {
    if (typeof pattern === 'string') {
      if (stderr.includes(pattern)) {
        return `${message}\n\n💡 技术详情：退出码 ${exitCode}`;
      }
    } else {
      if (pattern.test(stderr)) {
        return `${message}\n\n💡 技术详情：退出码 ${exitCode}`;
      }
    }
  }
  
  // 2. 根据退出码返回通用消息
  const codeMessage = FFMPEG_ERROR_CODES[exitCode];
  if (codeMessage) {
    return `${codeMessage}\n\n💡 技术详情：退出码 ${exitCode}`;
  }
  
  // 3. 未知错误，返回详细信息
  return `转换失败：未知错误（退出码 ${exitCode}）\n\n💡 建议：请检查输入文件格式或联系技术支持`;
}

/**
 * 检查是否为致命错误（需要立即停止）
 * 
 * @param stderr FFmpeg stderr 输出内容
 * @returns 是否为致命错误
 */
export function isFatalError(stderr: string): boolean {
  const fatalPatterns = [
    /No such file or directory/i,
    /Permission denied/i,
    /command not found/i,
    /Cannot find a matching stream/i,
  ];
  
  return fatalPatterns.some(pattern => pattern.test(stderr));
}

/**
 * 提取 stderr 中的关键错误信息（最后 5 行）
 * 
 * @param stderr FFmpeg stderr 完整输出
 * @returns 关键错误信息
 */
export function extractErrorDetails(stderr: string): string {
  const lines = stderr.trim().split('\n');
  const lastLines = lines.slice(-5).join('\n');
  return lastLines;
}
