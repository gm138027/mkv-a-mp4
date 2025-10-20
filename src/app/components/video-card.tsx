'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import type { UploadState, VideoItem } from '@/app/state';
import { useTranslation } from '@/lib/i18n';

const statusClass: Record<UploadState, string> = {
  idle: 'status-chip--idle',
  ready: 'status-chip--ready',
  reading: 'status-chip--reading',
  processing: 'status-chip--processing',
  completed: 'status-chip--completed',
  failed: 'status-chip--failed',
};

export interface VideoCardProps {
  video: VideoItem;
  onRemove?: (id: string) => void;
}

export const VideoCard = ({ video, onRemove }: VideoCardProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="video-card">
      <div className="video-card__thumb">
        <Image src="/video-placeholder.svg" alt={t('common.label.videoPlaceholder')} width={48} height={48} loading="lazy" />
      </div>
      <div className="video-card__meta">
        <span className="video-card__name">{video.name}</span>
        <span className="video-card__size">{video.sizeMb.toFixed(2)} MB</span>
      </div>
      <div className="video-card__status">
        <span className={clsx('status-chip', statusClass[video.state])}>
          {t(`video.status.${video.state}`)}
        </span>
        {onRemove ? (
          <button
            type="button"
            className="close-button"
            onClick={() => onRemove(video.id)}
            aria-label={t('common.label.removeVideo')}
          >
            <Image src="/icons/remove.svg" alt={t('common.label.videoPlaceholder')} width={12} height={12} />
          </button>
        ) : null}
      </div>
    </div>
  );
};

export interface VideoProgressProps {
  video: VideoItem;
  onRemove?: (id: string) => void;
}

export const VideoProgress = ({ video, onRemove }: VideoProgressProps) => {
  const { t } = useTranslation();
  const canDownload = video.state === "completed" && !!video.downloadUrl;

  const handleDownload = () => {
    if (video.downloadUrl) {
      window.location.href = video.downloadUrl;
    }
  };

  // 平滑进度，即使实际进度跳跃也能看起来顺畅
  const [displayProgress, setDisplayProgress] = useState(0);
  const targetProgress = video.progress ?? 0;

  useEffect(() => {
    // 如果目标进度大于当前显示进度，平滑过渡
    if (targetProgress > displayProgress) {
      // 使用 requestAnimationFrame 确保流畅动画
      const timer = setTimeout(() => {
        setDisplayProgress(targetProgress);
      }, 50); // 50ms 延迟，让 CSS transition 有时间执行
      return () => clearTimeout(timer);
    } else if (targetProgress < displayProgress) {
      // 如果目标进度小于当前进度，应该反向回退（但这不应该发生）
      setDisplayProgress(targetProgress);
    }
  }, [targetProgress, displayProgress]);

  return (
    <div className="video-card video-card--progress">
      <div className="video-card__thumb">
        <Image src="/video-placeholder.svg" alt={t('common.label.videoPlaceholder')} width={48} height={48} loading="lazy" />
      </div>
      <div className="video-card__meta">
        <span className="video-card__name">{video.name}</span>
        <span className="video-card__size">{video.sizeMb.toFixed(2)} MB</span>
      </div>
      <div className="video-card__progress">
        <div className="video-progress__bar">
          <div className="video-progress__fill" style={{ width: `${displayProgress}%` }} />
        </div>
      </div>
      <div className="video-card__status">
        <span className={clsx("status-chip", statusClass[video.state])}>
          {t(`video.status.${video.state}`)}
        </span>
        {canDownload ? (
          <button
            type="button"
            className="download-button"
            onClick={handleDownload}
            title={t('common.label.downloadFile')}
          >
            <Image src="/icons/download.svg" alt={t('common.label.videoPlaceholder')} width={24} height={24} />
          </button>
        ) : null}
        {/* ✅ 只在准备状态（ready）显示删除按钮，一旦开始读取就不能删除 */}
        {onRemove && (video.state === 'ready' || video.state === 'idle') ? (
          <button
            type="button"
            className="close-button"
            onClick={() => onRemove(video.id)}
            aria-label={t('common.label.removeVideo')}
          >
            <Image src="/icons/remove.svg" alt={t('common.label.videoPlaceholder')} width={12} height={12} />
          </button>
        ) : null}
      </div>
    </div>
  );
};

export interface VideoDownloadProps {
  video: VideoItem;
}

export const VideoDownload = ({ video }: VideoDownloadProps) => {
  const { t } = useTranslation();
  
  const handleDownload = () => {
    if (video.downloadUrl) {
      // ✅ 使用 <a> 标签触发下载，而不是 window.location.href
      const a = document.createElement('a');
      a.href = video.downloadUrl;
      a.download = video.name.replace(/\.mkv$/i, '.mp4'); // 正确的文件名
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="video-card video-card--progress">
      <div className="video-card__thumb">
        <Image src="/video-placeholder.svg" alt={t('common.label.videoPlaceholder')} width={48} height={48} loading="lazy" />
      </div>
      <div className="video-card__meta">
        <span className="video-card__name">{video.name}</span>
        <span className="video-card__size">{video.sizeMb.toFixed(2)} MB</span>
      </div>
      <div className="video-card__progress">
        <div className="video-progress__bar">
          <div className="video-progress__fill" style={{ width: '100%' }} />
        </div>
      </div>
      <div className="video-card__status">
        <span className={clsx('status-chip', statusClass[video.state])}>
          {t(`video.status.${video.state}`)}
        </span>
        {video.downloadUrl && (
          <button
            type="button"
            className="download-button"
            onClick={handleDownload}
            title={t('common.label.downloadFile')}
          >
            <Image src="/icons/download.svg" alt={t('common.label.videoPlaceholder')} width={24} height={24} />
          </button>
        )}
      </div>
    </div>
  );
};


