import clsx from 'clsx';
import Image from 'next/image';
import type { StageKey, VideoItem } from '@/app/state';
import { useTranslation } from '@/lib/i18n';

interface StageContainerProps {
  kind: StageKey;
  activeStage: StageKey;
  title?: string;
  children: React.ReactNode;
}

export const StageContainer = ({ kind, activeStage, title, children }: StageContainerProps) => {
  const isActive = kind === activeStage;
  return (
    <section className={clsx('stage', { 'stage--inactive': !isActive })} data-stage={kind}>
      {title && <h2 className="stage__title">{title}</h2>}
      {children}
    </section>
  );
};

interface UploadPanelProps {
  onPickFile: () => void;
}

export const UploadPanel = ({ onPickFile }: UploadPanelProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="upload-panel">
      <button type="button" className="primary-button" onClick={onPickFile}>
        <Image 
          src="/icons/folder.svg" 
          alt="" 
          width={50} 
          height={50}
          priority
        />
        {t('common.button.selectFile')}
      </button>
      <p className="upload-panel__hint">
        {t('upload.sizeHint')}
      </p>
    </div>
  );
};

interface ButtonContainerProps {
  leftButton: React.ReactNode;
  rightButton: React.ReactNode;
}

export const ButtonContainer = ({ leftButton, rightButton }: ButtonContainerProps) => (
  <div className="button-container-external">
    {leftButton}
    <div className="button-spacer"></div>
    {rightButton}
  </div>
);

interface VideoListProps {
  videos: VideoItem[];
  renderItem: (video: VideoItem) => React.ReactNode;
}

export const VideoList = ({ videos, renderItem }: VideoListProps) => (
  <div className="video-list">
    {videos.map((video) => (
      <div key={video.id} className="video-list__item">
        {renderItem(video)}
      </div>
    ))}
  </div>
);

interface ActionBarProps {
  left: React.ReactNode;
  right: React.ReactNode;
  className?: string;
}

export const ActionBar = ({ left, right, className }: ActionBarProps) => (
  <div className={clsx('action-bar', className)}>
    <div className="action-bar__left">{left}</div>
    <div className="action-bar__right">{right}</div>
  </div>
);
