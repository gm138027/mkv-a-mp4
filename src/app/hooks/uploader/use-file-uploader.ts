/**
 * 文件转换 Hook（浏览器端 ffmpeg.wasm）
 * 职责：处理浏览器端视频转换、进度管理
 * 
 * ✅ 重构说明：
 * - 保持相同的接口和状态流转
 * - 将服务器端上传改为浏览器端转换
 * - 使用 ffmpeg.wasm 替代 API 调用
 */

import { useCallback, useState } from 'react';
import type { StageAction } from '@/app/state';
import type { AdvancedSettings } from '@/app/components/advanced-settings/types';
import type { ActiveTask } from './types';
import { convertMKVtoMP4 } from '@/lib/ffmpeg';

export const useFileUploader = (
  dispatch: (action: StageAction) => void,
  pendingFiles: Map<string, File>
) => {
  const [activeTasks, setActiveTasks] = useState<Map<string, ActiveTask>>(new Map());

  /**
   * 浏览器端转换单个文件（使用 ffmpeg.wasm）
   * 状态流转：reading（加载FFmpeg） -> processing（转换中） -> completed
   */
  const uploadSingleFile = useCallback(
    async (videoId: string, file: File, settings?: AdvancedSettings): Promise<void> => {
      // 生成伪 taskId（保持接口兼容）
      const taskId = `browser_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // ⚠️ 文件大小（用于错误提示）
      const fileSizeMB = file.size / (1024 * 1024);

      try {
        // 🔒 [封存] 文件大小限制（用户要求先测试不同大小后再设置）
        // const MAX_FILE_SIZE_MB = 200;
        // if (fileSizeMB > MAX_FILE_SIZE_MB) {
        //   throw new Error(`文件过大 (${fileSizeMB.toFixed(1)}MB)`);
        // }

        // 注册活动任务
        setActiveTasks((prev) => {
          const next = new Map(prev);
          next.set(videoId, { taskId, videoId, file });
          return next;
        });

        // 🔒 [封存] 高级参数映射（浏览器版本暂不使用）
        // const videoCodec = settings?.video.encoder === 'copy' ? 'copy' : ...
        // const audioCodec = settings?.audio.encoder === 'copy' ? 'copy' : ...
        // const quality = settings?.video.quality === 'original' ? 'original' : ...
        // const resolution = settings?.video.resolution === 'original' ? 'original' : ...

        console.log(`[Browser Convert] 开始转换: ${file.name} (${fileSizeMB.toFixed(1)}MB)`);

        // ✅ 浏览器版本：始终使用默认设置（Stream Copy，保留所有）
        const outputBlob = await convertMKVtoMP4({
          inputFile: file,
          // videoCodec: 'copy',    // 默认值
          // audioCodec: 'copy',    // 默认值
          // quality: 'original',   // 默认值
          // resolution: 'original',// 默认值
          onProgress: (progress, stage) => {
            // ✅ 多文件处理：让进度连续递增，不回退
            // reading: 0-50%, processing: 50-100%
            let adjustedProgress;
            if (stage === 'reading') {
              adjustedProgress = Math.round(progress * 0.5);  // 0% → 50%
            } else {
              adjustedProgress = 50 + Math.round(progress * 0.5);  // 50% → 100%
            }
            
            const state = stage === 'reading' ? 'reading' : 'processing';
            
            console.log(`[Browser Convert] ${file.name} [${stage}] ${progress}% → adjusted: ${adjustedProgress}%`);
            dispatch({
              type: 'UPDATE_VIDEO',
              id: videoId,
              patch: { 
                taskId,
                state, 
                progress: adjustedProgress  // 使用调整后的连续进度
              },
            });
          },
          onLog: (message) => {
            console.log(`[${file.name}]`, message);
          },
        });

        console.log(`[Browser Convert] 转换完成: ${file.name}`);

        // 阶段3：转换完成
        dispatch({
          type: 'UPDATE_VIDEO',
          id: videoId,
          patch: { 
            state: 'completed', 
            progress: 100,
            downloadUrl: URL.createObjectURL(outputBlob),
          },
        });

        // ✅ 移除活动任务
        setActiveTasks((prev) => {
          const next = new Map(prev);
          next.delete(videoId);
          return next;
        });

      } catch (err) {
        // Note: Error messages are kept as codes for now, will be translated by UI layer if needed
        let message = err instanceof Error ? err.message : 'Conversion failed';
        
        // ✅ Keep technical error messages in English for debugging
        // UI layer can translate if needed by checking message patterns
        if (message.includes('Array buffer allocation failed') || 
            message.includes('out of memory')) {
          message = `Out of memory! File ${fileSizeMB.toFixed(1)}MB exceeds browser capacity. Recommend using <500MB files.`;
        } else if (message.includes('Failed to load')) {
          message = `File read failed. Please check if the file is complete.`;
        }
        
        console.error(`[Browser Convert] 转换失败: ${file.name}`, err);
        
        dispatch({
          type: 'UPDATE_VIDEO',
          id: videoId,
          patch: { state: 'failed', message },
        });

        // ✅ 失败也要移除活动任务
        setActiveTasks((prev) => {
          const next = new Map(prev);
          next.delete(videoId);
          return next;
        });

        throw err;
      }
    },
    [dispatch]
  );

  /**
   * 批量转换所有待处理文件（浏览器端 - 串行转换）
   * ⚠️ 重要：ffmpeg.wasm 是单例，必须串行转换，不能并发！
   */
  const startUpload = useCallback(
    async (onError?: (message: string) => void) => {
      if (pendingFiles.size === 0) {
        if (onError) {
          onError('errors.selectAtLeastOne');
        }
        return;
      }

      dispatch({ type: 'SET_STAGE', stage: 'progress' });

      const entries = Array.from(pendingFiles.entries());
      
      // ✅ 串行转换（一个接一个），使用默认设置
      for (const [videoId, file] of entries) {
        try {
          // 🔒 [封存] 不再传递 settings 参数，使用默认的 Stream Copy
          await uploadSingleFile(videoId, file);
        } catch (err) {
          console.error(`[Browser Convert] 转换文件 ${file.name} 失败:`, err);
          // 继续处理下一个文件
        }
      }

      console.log('[Browser Convert] 所有文件转换完成');
    },
    [dispatch, pendingFiles, uploadSingleFile]
  );

  return {
    activeTasks,
    setActiveTasks,
    uploadSingleFile,
    startUpload,
  };
};
