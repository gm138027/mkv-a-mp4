/**
 * 字幕探测工具模块
 * 
 * 用于检测视频文件是否包含字幕流
 */

import { spawn } from 'child_process';

/**
 * 探测视频文件中的字幕流数量
 * 
 * @param inputPath 视频文件路径
 * @returns 字幕流数量，失败返回 0
 */
export async function probeSubtitleStreams(inputPath: string): Promise<number> {
  return new Promise((resolve) => {
    const ffprobe = spawn('ffprobe', [
      '-v', 'quiet',
      '-show_streams',
      '-select_streams', 's',  // 只选择字幕流
      '-of', 'json',
      inputPath
    ]);

    let output = '';

    ffprobe.stdout.on('data', (data) => {
      output += data.toString();
    });

    ffprobe.on('error', (error) => {
      console.error(`[SubtitleProbe] ❌ ffprobe 执行失败:`, error);
      resolve(0);  // 失败时返回 0
    });

    ffprobe.on('close', (code) => {
      if (code !== 0) {
        console.error(`[SubtitleProbe] ❌ ffprobe 退出码: ${code}`);
        resolve(0);  // 失败时返回 0
        return;
      }

      try {
        const result = JSON.parse(output);
        const subtitleStreams = result.streams || [];
        const count = subtitleStreams.length;
        
        console.log(`[SubtitleProbe] ✅ 检测到 ${count} 个字幕流`);
        resolve(count);
      } catch (parseError) {
        console.error(`[SubtitleProbe] ❌ 解析 JSON 失败:`, parseError);
        resolve(0);  // 解析失败时返回 0
      }
    });
  });
}

/**
 * 检查视频是否包含字幕流
 * 
 * @param inputPath 视频文件路径
 * @returns true 表示有字幕，false 表示无字幕
 */
export async function hasSubtitles(inputPath: string): Promise<boolean> {
  const count = await probeSubtitleStreams(inputPath);
  return count > 0;
}
