/**
 * FFmpeg React Hook
 * 
 * 提供简单的 React 集成，管理转换状态和生命周期
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { convertMKVtoMP4, preloadFFmpeg, isFFmpegSupported } from './index';
import type { VideoTask, ConversionConfig } from './types';
import { DEFAULT_CONFIG } from './types';
import { useAnalytics } from '@/app/hooks/useAnalytics';

export function useFFmpeg() {
  const [tasks, setTasks] = useState<Map<string, VideoTask>>(new Map());
  const [isSupported, setIsSupported] = useState(true);
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false);
  const { 
    trackConversionStart, 
    trackConversionComplete, 
    trackConversionError,
    trackFileDownload, 
    trackBatchDownload 
  } = useAnalytics();

  // 检查浏览器支持
  useEffect(() => {
    setIsSupported(isFFmpegSupported());
  }, []);

  // 预加载 FFmpeg（可选，首次加载会慢一点）
  useEffect(() => {
    if (isSupported) {
      preloadFFmpeg()
        .then(() => setFfmpegLoaded(true))
        .catch(err => console.error('预加载失败:', err));
    }
  }, [isSupported]);

  /**
   * 添加转换任务
   */
  const addTask = useCallback((file: File, config?: Partial<ConversionConfig>): string => {
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const task: VideoTask = {
      id: taskId,
      file,
      status: 'idle',
      progress: 0,
      logs: [],
      createdAt: Date.now(),
    };

    setTasks(prev => new Map(prev).set(taskId, task));
    
    // 自动开始转换
    startConversion(taskId, config);
    
    return taskId;
  }, []);

  /**
   * 开始转换
   */
  const startConversion = useCallback(async (
    taskId: string,
    config?: Partial<ConversionConfig>
  ) => {
    const task = tasks.get(taskId);
    if (!task) return;

    // 追踪转换开始
    trackConversionStart(task.file.name, task.file.size);

    // 更新状态为 loading
    updateTask(taskId, { status: 'loading', logs: [...task.logs, '🔄 正在加载转换引擎...'] });

    const finalConfig = { ...DEFAULT_CONFIG, ...config };
    const startTime = Date.now();

    try {
      const outputBlob = await convertMKVtoMP4({
        inputFile: task.file,
        videoCodec: finalConfig.videoCodec,
        audioCodec: finalConfig.audioCodec,
        quality: finalConfig.quality,
        resolution: finalConfig.resolution,
        onProgress: (progress) => {
          updateTask(taskId, { 
            status: 'converting', 
            progress,
          });
        },
        onLog: (message) => {
          setTasks(prev => {
            const newMap = new Map(prev);
            const currentTask = newMap.get(taskId);
            if (currentTask) {
              newMap.set(taskId, {
                ...currentTask,
                logs: [...currentTask.logs, message],
              });
            }
            return newMap;
          });
        },
      });

      // 转换成功
      const duration = Date.now() - startTime;
      trackConversionComplete(task.file.name, duration);
      
      updateTask(taskId, {
        status: 'completed',
        progress: 100,
        outputBlob,
        completedAt: Date.now(),
        logs: [...(tasks.get(taskId)?.logs || []), '✅ 转换完成！'],
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // 追踪转换错误
      trackConversionError(task.file.name, errorMessage);
      
      updateTask(taskId, {
        status: 'failed',
        error: errorMessage,
        logs: [...(tasks.get(taskId)?.logs || []), `❌ 错误: ${errorMessage}`],
      });
    }
  }, [tasks, trackConversionStart, trackConversionComplete, trackConversionError]);

  /**
   * 更新任务
   */
  const updateTask = useCallback((taskId: string, updates: Partial<VideoTask>) => {
    setTasks(prev => {
      const newMap = new Map(prev);
      const task = newMap.get(taskId);
      if (task) {
        newMap.set(taskId, { ...task, ...updates });
      }
      return newMap;
    });
  }, []);

  /**
   * 下载文件
   */
  const downloadTask = useCallback((taskId: string) => {
    const task = tasks.get(taskId);
    if (!task?.outputBlob) return;

    const url = URL.createObjectURL(task.outputBlob);
    const a = document.createElement('a');
    const fileName = task.file.name.replace(/\.mkv$/i, '.mp4');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // 追踪下载事件
    trackFileDownload(fileName, task.outputBlob.size);
  }, [tasks, trackFileDownload]);

  /**
   * 删除任务
   */
  const removeTask = useCallback((taskId: string) => {
    setTasks(prev => {
      const newMap = new Map(prev);
      
      // 清理 Blob URL
      const task = newMap.get(taskId);
      if (task?.outputBlob) {
        URL.revokeObjectURL(URL.createObjectURL(task.outputBlob));
      }
      
      newMap.delete(taskId);
      return newMap;
    });
  }, []);

  /**
   * 批量添加任务
   */
  const addTasks = useCallback((files: File[], config?: Partial<ConversionConfig>): string[] => {
    return files.map(file => addTask(file, config));
  }, [addTask]);

  /**
   * 下载所有完成的任务
   */
  const downloadAll = useCallback(() => {
    const completedTasks = Array.from(tasks.entries()).filter(
      ([_, task]) => task.status === 'completed' && task.outputBlob
    );
    
    if (completedTasks.length === 0) return;
    
    // 追踪批量下载事件
    const totalSize = completedTasks.reduce(
      (sum, [_, task]) => sum + (task.outputBlob?.size || 0), 
      0
    );
    trackBatchDownload(completedTasks.length, totalSize);
    
    // 执行下载
    completedTasks.forEach(([taskId]) => {
      downloadTask(taskId);
    });
  }, [tasks, downloadTask, trackBatchDownload]);

  /**
   * 清空所有任务
   */
  const clearAll = useCallback(() => {
    // 清理所有 Blob URLs
    tasks.forEach(task => {
      if (task.outputBlob) {
        URL.revokeObjectURL(URL.createObjectURL(task.outputBlob));
      }
    });
    setTasks(new Map());
  }, [tasks]);

  // 统计信息
  const stats = {
    total: tasks.size,
    idle: Array.from(tasks.values()).filter(t => t.status === 'idle').length,
    loading: Array.from(tasks.values()).filter(t => t.status === 'loading').length,
    converting: Array.from(tasks.values()).filter(t => t.status === 'converting').length,
    completed: Array.from(tasks.values()).filter(t => t.status === 'completed').length,
    failed: Array.from(tasks.values()).filter(t => t.status === 'failed').length,
  };

  return {
    // 状态
    tasks: Array.from(tasks.values()),
    tasksMap: tasks,
    isSupported,
    ffmpegLoaded,
    stats,

    // 操作
    addTask,
    addTasks,
    startConversion,
    downloadTask,
    removeTask,
    downloadAll,
    clearAll,
  };
}
