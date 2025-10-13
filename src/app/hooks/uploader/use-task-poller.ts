/**
 * 任务完成检测 Hook（浏览器端转换）
 * 职责：检测所有浏览器转换任务是否完成，并切换到下载阶段
 * 
 * ✅ 重构说明：
 * - 移除服务器 API 轮询逻辑
 * - 浏览器端转换直接在 use-file-uploader 中完成
 * - 此 hook 仅保留任务完成检测功能
 */

import { useEffect } from 'react';
import type { StageAction, StageState } from '@/app/state';
import type { ActiveTask } from './types';

export const useTaskPoller = (
  state: StageState,
  dispatch: (action: StageAction) => void,
  activeTasks: Map<string, ActiveTask>,
  _setActiveTasks: React.Dispatch<React.SetStateAction<Map<string, ActiveTask>>>
) => {
  /**
   * 检查是否所有任务都已完成
   * 浏览器端转换不需要轮询，转换完成后直接更新状态
   */
  useEffect(() => {
    if (state.activeStage !== 'progress') return;

    const allFinished =
      state.videos.length > 0 &&
      state.videos.every((v) => v.state === 'completed' || v.state === 'failed');

    if (activeTasks.size === 0 && allFinished) {
      console.log('[Browser Convert] 所有任务已完成，切换到下载阶段');
      dispatch({ type: 'SET_STAGE', stage: 'download' });
    }
  }, [activeTasks, state.videos, state.activeStage, dispatch]);

  // 保持接口兼容（即使不再使用）
  return {
    startPolling: () => {
      console.log('[Browser Convert] 浏览器端转换不需要轮询');
    },
  };
};
