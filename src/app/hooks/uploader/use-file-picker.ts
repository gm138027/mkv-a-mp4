/**
 * 文件选择 Hook
 * 职责：处理文件选择、验证和状态管理
 */

import { useCallback, useRef } from 'react';
import type { StageAction } from '@/app/state';
import { createVideoItem } from '@/app/lib/video-adapter';
import { generateId } from '@/app/lib/id';
import { validateFiles } from '@/app/lib/file-validator';
import { useTranslation } from '@/lib/i18n';

export const useFilePicker = (dispatch: (action: StageAction) => void) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const setInputRef = useCallback((node: HTMLInputElement | null) => {
    inputRef.current = node;
  }, []);

  const triggerFilePicker = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleFileSelected = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const fileList = event.target.files;
      if (!fileList || fileList.length === 0) {
        return;
      }

      const files = Array.from(fileList);

      // 验证文件
      const validation = validateFiles(files);
      if (!validation.valid) {
        // Use translation key if available, fallback to error message
        const errorMessage = validation.errorKey 
          ? t(validation.errorKey, validation.errorParams ? Object.fromEntries(
              Object.entries(validation.errorParams).map(([k, v]) => [k, String(v)])
            ) : undefined)
          : (validation.error ?? t('errors.fileValidationFailed'));
        alert(errorMessage);
        // ✅ 关键修复：验证失败也要重置 input，否则无法重复选择相同文件
        event.target.value = '';
        return;
      }

      // ⚠️ 显示警告（大文件提示）
      if (validation.warning) {
        alert(validation.warning);
      }

      // 创建视频项并添加到状态
      const fileMap = new Map<string, File>();
      files.forEach((file) => {
        const videoId = generateId();
        const video = createVideoItem(file, videoId);
        dispatch({ type: 'ADD_VIDEO', video });
        fileMap.set(videoId, file);
      });

      dispatch({ type: 'SET_STAGE', stage: 'list' });

      // ✅ 重置 input，允许重复选择相同文件
      event.target.value = '';

      return fileMap;
    },
    [dispatch]
  );

  return {
    inputRef,
    setInputRef,
    triggerFilePicker,
    handleFileSelected,
  };
};
