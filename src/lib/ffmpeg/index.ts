/**
 * FFmpeg.wasm 浏览器端封装层
 * 
 * 这是整个转换系统的核心，运行在用户浏览器中
 * 文件从不上传到服务器，100% 隐私安全
 */

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

/**
 * FFmpeg 实例管理器（单例模式）
 */
class FFmpegManager {
  private ffmpeg: FFmpeg | null = null;
  private loaded = false;
  private loading = false;

  /**
   * 获取 FFmpeg 实例（懒加载）
   */
  async getInstance(): Promise<FFmpeg> {
    if (this.ffmpeg && this.loaded) {
      return this.ffmpeg;
    }

    if (this.loading) {
      // 等待正在进行的加载
      await this.waitForLoad();
      return this.ffmpeg!;
    }

    this.loading = true;
    this.ffmpeg = new FFmpeg();

    // 配置日志回调
    this.ffmpeg.on('log', ({ message }) => {
      console.log('[FFmpeg]', message);
    });

    try {
      // 加载 FFmpeg.wasm 核心文件
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
      await this.ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });

      this.loaded = true;
      this.loading = false;
      console.log('✅ FFmpeg.wasm 加载成功');
      
      return this.ffmpeg;
    } catch (error) {
      this.loading = false;
      console.error('❌ FFmpeg.wasm 加载失败:', error);
      throw new Error('无法加载视频转换引擎，请检查网络连接或刷新页面重试');
    }
  }

  /**
   * 等待加载完成
   */
  private async waitForLoad(): Promise<void> {
    while (this.loading) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  /**
   * 检查是否已加载
   */
  isLoaded(): boolean {
    return this.loaded;
  }
}

// 导出单例实例
export const ffmpegManager = new FFmpegManager();

/**
 * 转换阶段
 * - reading: 文件读取阶段（0-100%）
 * - processing: FFmpeg 转换阶段（0-100%）
 */
export type ConversionStage = 'reading' | 'processing';

/**
 * 转换选项
 */
export interface ConversionOptions {
  /** 输入文件 */
  inputFile: File;
  
  /** 视频编码器 */
  videoCodec?: 'copy' | 'libx264' | 'libx265';
  
  /** 音频编码器 */
  audioCodec?: 'copy' | 'aac' | 'mp3';
  
  /** 视频质量 */
  quality?: 'original' | 'high' | 'medium' | 'low';
  
  /** 分辨率 */
  resolution?: 'original' | '2160p' | '1080p' | '720p' | '480p' | '360p';
  
  /** 进度回调（progress: 0-100, stage: 当前阶段） */
  onProgress?: (progress: number, stage: ConversionStage) => void;
  
  /** 日志回调 */
  onLog?: (message: string) => void;
}

/**
 * MKV 转 MP4 - 主转换函数
 */
export async function convertMKVtoMP4(options: ConversionOptions): Promise<Blob> {
  const {
    inputFile,
    videoCodec = 'copy',
    audioCodec = 'copy',
    quality = 'original',
    resolution = 'original',
    onProgress,
    onLog,
  } = options;

  // 1. 获取 FFmpeg 实例
  const ffmpeg = await ffmpegManager.getInstance();

  // 2. 定义文件名（需要在 finally 中清理，所以提前定义）
  const inputName = 'input.mkv';
  const outputName = 'output.mp4';

  // 3. 配置进度和日志回调
  // ⚠️ 重要：每次转换都创建新的回调函数，避免多个任务互相干扰
  const progressHandler = ({ progress }: { progress: number }) => {
    // FFmpeg 返回 0-1 的进度，转换为 0-100
    const percent = Math.round(progress * 100);
    console.log(`[FFmpeg Progress] ${percent}%`);
    onProgress?.(percent, 'processing');  // processing 阶段，0-100%
  };

  const logHandler = ({ message }: { message: string }) => {
    onLog?.(message);
  };

  // 注册回调
  if (onProgress) {
    ffmpeg.on('progress', progressHandler);
  }
  if (onLog) {
    ffmpeg.on('log', logHandler);
  }

  try {
    // 4. 读取阶段：使用 FileReader 读取文件（获取真实进度）
    onProgress?.(0, 'reading');
    onLog?.('📥 正在读取文件...');
    
    const fileData = await new Promise<Uint8Array>((resolve, reject) => {
      const reader = new FileReader();
      
      // 进度更新
      reader.onprogress = (e: ProgressEvent<FileReader>) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress?.(percent, 'reading');
        }
      };
      
      // 读取完成
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        resolve(new Uint8Array(arrayBuffer));
      };
      
      // 读取失败
      reader.onerror = () => {
        reject(new Error('文件读取失败'));
      };
      
      // 开始读取
      reader.readAsArrayBuffer(inputFile);
    });
    
    onProgress?.(100, 'reading');
    onLog?.('✅ 文件读取完成，正在写入虚拟文件系统...');
    
    // 写入到 FFmpeg 虚拟文件系统（这个很快，不需要进度）
    await ffmpeg.writeFile(inputName, fileData);

    // 4. 构建 FFmpeg 命令参数
    const args = buildFFmpegArgs({
      inputName,
      outputName,
      videoCodec,
      audioCodec,
      quality,
      resolution,
    });

    // 5. 转换阶段：执行 FFmpeg (0-100%)
    onProgress?.(0, 'processing');
    onLog?.(`🚀 开始转换: ${args.join(' ')}`);
    
    await ffmpeg.exec(args);  // progressHandler 会自动更新 0-100%

    // 6. 读取输出文件
    onLog?.('📤 正在生成文件...');
    const data = await ffmpeg.readFile(outputName);

    onLog?.('✅ 转换完成！');
    
    // 7. 返回 Blob (convert to standard Uint8Array to avoid SharedArrayBuffer issues)
    const uint8Data = typeof data === 'string' ? new TextEncoder().encode(data) : new Uint8Array(data);
    return new Blob([uint8Data], { type: 'video/mp4' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    onLog?.(`❌ 转换失败: ${errorMessage}`);
    throw new Error(`FFmpeg 转换失败: ${errorMessage}`);
  } finally {
    // ✅ 清理监听器，避免内存泄漏
    if (onProgress) {
      ffmpeg.off('progress', progressHandler);
    }
    if (onLog) {
      ffmpeg.off('log', logHandler);
    }
    
    // ✅ 强制清理虚拟文件系统（无论成功或失败）
    try {
      await ffmpeg.deleteFile(inputName);
      onLog?.(`🗑️ 已清理输入文件: ${inputName}`);
    } catch (cleanupError) {
      console.warn('清理输入文件失败:', cleanupError);
    }
    
    try {
      await ffmpeg.deleteFile(outputName);
      onLog?.(`🗑️ 已清理输出文件: ${outputName}`);
    } catch (cleanupError) {
      console.warn('清理输出文件失败:', cleanupError);
    }
  }
}

/**
 * 构建 FFmpeg 命令参数
 */
function buildFFmpegArgs(params: {
  inputName: string;
  outputName: string;
  videoCodec: string;
  audioCodec: string;
  quality: string;
  resolution: string;
}): string[] {
  const { inputName, outputName, videoCodec, audioCodec, quality, resolution } = params;

  const args: string[] = ['-i', inputName];

  // 视频编码
  if (videoCodec === 'copy') {
    args.push('-c:v', 'copy');
  } else {
    args.push('-c:v', videoCodec);

    // 质量设置（只在重新编码时有效）
    if (quality !== 'original') {
      const crf = quality === 'high' ? '18' : quality === 'medium' ? '23' : '28';
      args.push('-crf', crf);
    }

    // 分辨率设置
    if (resolution !== 'original') {
      const resolutionMap: Record<string, string> = {
        '2160p': '3840:2160',
        '1080p': '1920:1080',
        '720p': '1280:720',
        '480p': '854:480',
        '360p': '640:360',
      };
      const size = resolutionMap[resolution];
      if (size) {
        args.push('-vf', `scale=${size}`);
      }
    }
  }

  // 音频编码
  if (audioCodec === 'copy') {
    args.push('-c:a', 'copy');
  } else {
    args.push('-c:a', audioCodec);
    if (audioCodec === 'aac') {
      args.push('-b:a', '192k');
    }
  }

  // 输出文件
  args.push(outputName);

  return args;
}

/**
 * 获取视频元信息
 */
export async function getVideoInfo(file: File): Promise<{
  duration: number;
  width: number;
  height: number;
  hasAudio: boolean;
  hasSubtitles: boolean;
}> {
  const ffmpeg = await ffmpegManager.getInstance();

  try {
    const inputName = 'probe.mkv';
    await ffmpeg.writeFile(inputName, await fetchFile(file));

    // 使用 ffprobe 获取信息（如果可用）
    // 否则从日志中解析
    // TODO: 实现视频信息提取

    await ffmpeg.deleteFile(inputName);

    // 临时返回默认值
    return {
      duration: 0,
      width: 1920,
      height: 1080,
      hasAudio: true,
      hasSubtitles: false,
    };
  } catch (error) {
    console.error('获取视频信息失败:', error);
    throw error;
  }
}

/**
 * 检查浏览器是否支持 FFmpeg.wasm
 */
export function isFFmpegSupported(): boolean {
  // 检查 SharedArrayBuffer 和 WebAssembly
  return (
    typeof SharedArrayBuffer !== 'undefined' &&
    typeof WebAssembly !== 'undefined' &&
    typeof Worker !== 'undefined'
  );
}

/**
 * 预加载 FFmpeg（可选，用于优化首次转换速度）
 */
export async function preloadFFmpeg(): Promise<void> {
  try {
    await ffmpegManager.getInstance();
  } catch (error) {
    console.error('预加载 FFmpeg 失败:', error);
  }
}
