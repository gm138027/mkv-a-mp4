/**
 * 上传器主入口
 * 职责：组合所有上传相关的 Hook，提供统一的接口
 */

import { useState, useCallback } from 'react';
import type { StageAction, StageState } from '@/app/state';
import { useFilePicker } from './use-file-picker';
import { useFileUploader } from './use-file-uploader';
import { useTaskPoller } from './use-task-poller';

export const useUploader = (state: StageState, dispatch: (action: StageAction) => void) => {
  const [pendingFiles, setPendingFiles] = useState<Map<string, File>>(new Map());

  // 文件选择
  const filePicker = useFilePicker(dispatch);

  // 包装 handleFileSelected 以更新 pendingFiles
  const handleFileSelected = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newFiles = filePicker.handleFileSelected(event);
      if (newFiles) {
        setPendingFiles((prev) => {
          const next = new Map(prev);
          newFiles.forEach((file, videoId) => {
            next.set(videoId, file);
          });
          return next;
        });
      }
    },
    [filePicker]
  );

  // 文件上传
  const fileUploader = useFileUploader(dispatch, pendingFiles);

  // 任务轮询
  useTaskPoller(state, dispatch, fileUploader.activeTasks, fileUploader.setActiveTasks);

  // 重置内部状态
  const resetInternal = useCallback(() => {
    setPendingFiles(new Map());
    fileUploader.setActiveTasks(new Map());
  }, [fileUploader]);

  // 从 pendingFiles 中移除单个文件
  const removePendingFile = useCallback((videoId: string) => {
    setPendingFiles((prev) => {
      const next = new Map(prev);
      next.delete(videoId);
      return next;
    });
  }, []);

  return {
    setInputRef: filePicker.setInputRef,
    triggerFilePicker: filePicker.triggerFilePicker,
    handleFileSelected,
    startUpload: fileUploader.startUpload,
    activeTasks: fileUploader.activeTasks,
    resetInternal,
    removePendingFile,
  };
};
