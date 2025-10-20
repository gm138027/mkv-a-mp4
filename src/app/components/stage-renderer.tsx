import { useMemo } from 'react';
import Image from 'next/image';
import { StageContainer, UploadPanel, VideoList, ButtonContainer } from '@/app/components/structure';
import { VideoCard, VideoProgress, VideoDownload } from '@/app/components/video-card';
import { AdvancedSettings, type AdvancedSettingsType } from '@/app/components/advanced-settings';
import type { StageState, StageKey } from '@/app/state';
import { useTranslation } from '@/lib/i18n';

interface StageRendererProps {
  state: StageState;
  activeStage: StageKey;
  onPickFile: () => void;
  onAddMore: () => void;
  onConvert: () => void;
  onConvertMore: () => void;
  onRemove: (id: string) => void;
  // 🔒 [封存] 高级功能参数（浏览器版本暂不使用）
  advancedSettings?: AdvancedSettingsType;
  onAdvancedSettingsChange?: (settings: AdvancedSettingsType) => void;
  taskId?: string; // ✅ 任务 ID，用于字幕轨道探测
}

export const StageRenderer = ({
  state,
  activeStage,
  onPickFile,
  onAddMore,
  onConvert,
  onConvertMore,
  onRemove,
  advancedSettings,
  onAdvancedSettingsChange,
  taskId,
}: StageRendererProps) => {
  const { t } = useTranslation();
  
  const overallProgress = useMemo(() => {
    if (state.videos.length === 0) {
      return null;
    }

    const total = state.videos.reduce((sum, video) => {
      if (video.state === 'completed' || video.state === 'failed') {
        return sum + 100;
      }

      const value = typeof video.progress === 'number' ? video.progress : 0;
      const clamped = Math.min(100, Math.max(0, Math.round(value)));
      return sum + clamped;
    }, 0);

    return Math.round(total / state.videos.length);
  }, [state.videos]);

  /**
   * 批量下载（浏览器版本：逐个触发下载）
   * 
   * 取消 ZIP 打包方案的原因：
   * 1. INP 性能问题：即使使用 STORE 模式，10个1GB文件仍需 3-6秒主线程阻塞
   * 2. 内存问题：所有文件同时加载到内存，容易导致浏览器崩溃
   * 3. 用户体验：点击后按钮"卡死"数秒，无响应
   * 
   * 逐个下载优势：
   * - INP < 50ms（几乎无阻塞）
   * - 零额外内存占用
   * - 浏览器原生处理，稳定可靠
   */
  const handleDownloadAll = () => {
    const completedVideos = state.videos.filter((v) => v.state === 'completed' && v.downloadUrl);

    if (completedVideos.length === 0) {
      return;
    }

    // 逐个触发下载，间隔 300ms 避免浏览器阻止
    completedVideos.forEach((video, index) => {
      setTimeout(() => {
        const a = document.createElement('a');
        a.href = video.downloadUrl!;
        a.download = video.name.replace(/\.mkv$/i, '.mp4');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }, index * 300);
    });
  };

  const renderDownloadAction = () => {
    const completedVideos = state.videos.filter((v) => v.state === 'completed' && v.downloadUrl);

    if (completedVideos.length === 0) {
      return (
        <button className="primary-button" disabled type="button">
          {t('common.button.downloadAll')}
          <Image src="/icons/next.svg" alt="" width={20} height={20} />
        </button>
      );
    }

    return (
      <button 
        className="primary-button" 
        type="button" 
        onClick={handleDownloadAll}
      >
        {t('common.button.downloadAll')}
        <Image src="/icons/next.svg" alt="" width={20} height={20} />
      </button>
    );
  };

  switch (activeStage) {
    case 'upload':
      return (
        <div className="stage-flow">
          <StageContainer kind="upload" activeStage={activeStage}>
            <UploadPanel onPickFile={onPickFile} />
          </StageContainer>
        </div>
      );
    case 'list':
      return (
        <div className="stage-flow">
          <StageContainer kind="list" activeStage={activeStage}>
            <VideoList
              videos={state.videos}
              renderItem={(item) => <VideoCard video={item} onRemove={onRemove} />}
            />
          </StageContainer>
          <ButtonContainer
            leftButton={
              <button className="secondary-button" type="button" onClick={onAddMore}>
                <Image src="/icons/file.svg" alt="" width={30} height={30} />
                {t('common.button.addMore')}
              </button>
            }
            rightButton={
              <button className="primary-button" type="button" onClick={onConvert}>
                {t('common.button.convert')}
                <Image src="/icons/next.svg" alt="" width={20} height={20} />
              </button>
            }
          />
          {/* 🔒 [封存] 高级设置面板（浏览器版本暂不显示） */}
          {/* <AdvancedSettings
            settings={advancedSettings}
            onChange={onAdvancedSettingsChange}
            taskId={taskId}
          /> */}
        </div>
      );
    case 'progress':
      return (
        <div className="stage-flow">
          <StageContainer kind="progress" activeStage={activeStage}>
            <VideoList
              videos={state.videos}
              renderItem={(item) => <VideoProgress video={item} onRemove={onRemove} />}
            />
          </StageContainer>
          <ButtonContainer
            leftButton={
              <button className="secondary-button" type="button" onClick={onConvertMore}>
                <Image src="/icons/file.svg" alt="" width={30} height={30} />
                {t('common.button.convertMore')}
              </button>
            }
            rightButton={
              <div className="progress-indicator">
                {overallProgress != null ? `${overallProgress}%` : '--'}
              </div>
            }
          />
        </div>
      );
    case 'download':
      return (
        <div className="stage-flow">
          <StageContainer kind="download" activeStage={activeStage}>
            <VideoList
              videos={state.videos}
              renderItem={(item) => <VideoDownload video={item} />}
            />
          </StageContainer>
          <ButtonContainer
            leftButton={
              <button className="secondary-button" type="button" onClick={onConvertMore}>
                <Image src="/icons/file.svg" alt="" width={30} height={30} />
                {t('common.button.convertMore')}
              </button>
            }
            rightButton={renderDownloadAction()}
          />
        </div>
      );
    default:
      return null;
  }
};
