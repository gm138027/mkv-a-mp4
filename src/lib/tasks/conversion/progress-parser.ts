/**
 * FFmpeg 进度解析器
 * 职责：解析 FFmpeg stderr 输出中的时长和进度信息
 */

/**
 * 从 FFmpeg 输出中解析视频总时长（秒）
 * 
 * @param output FFmpeg stderr 输出内容
 * @returns 视频时长（秒），如果未找到返回 null
 */
export const parseDuration = (output: string): number | null => {
  // 使用 matchAll 获取所有匹配，取最后一个（最新的）
  const matches = [...output.matchAll(/Duration: (\d{2}):(\d{2}):(\d{2}\.\d{2})/g)];
  if (matches.length === 0) return null;
  
  const match = matches[matches.length - 1];
  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const seconds = parseFloat(match[3]);
  
  return hours * 3600 + minutes * 60 + seconds;
};

/**
 * 从 FFmpeg 输出中解析当前处理时间（秒）
 * 
 * @param output FFmpeg stderr 输出内容
 * @returns 当前处理时间（秒），如果未找到返回 null
 */
export const parseTime = (output: string): number | null => {
  // 使用 matchAll 获取所有匹配，取最后一个（最新的进度）
  const matches = [...output.matchAll(/time=(\d{2}):(\d{2}):(\d{2}\.\d{2})/g)];
  if (matches.length === 0) return null;
  
  const match = matches[matches.length - 1];
  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const seconds = parseFloat(match[3]);
  
  return hours * 3600 + minutes * 60 + seconds;
};

/**
 * 计算转换进度百分比
 * 
 * @param currentTime 当前处理时间（秒）
 * @param totalDuration 视频总时长（秒）
 * @returns 进度百分比（0-95），最高限制为 95%，因为 100% 需要等待文件写入完成
 */
export const calculateProgress = (currentTime: number, totalDuration: number): number => {
  if (totalDuration <= 0) return 0;
  return Math.min(95, Math.round((currentTime / totalDuration) * 100));
};
