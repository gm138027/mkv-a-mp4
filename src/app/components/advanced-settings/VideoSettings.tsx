import { SelectField } from './SelectField';
import type { VideoSettings as VS, VideoEncoder, VideoQuality, VideoResolution, VideoFrameRate } from './types';
import { useTranslation } from '@/lib/i18n';

interface VideoSettingsProps {
  settings: VS;
  onChange: (settings: VS) => void;
}

export const VideoSettings = ({ settings, onChange }: VideoSettingsProps) => {
  const { t } = useTranslation();
  const isReencoding = settings.encoder !== 'copy';
  
  // 动态构建选项标签
  const encoderLabels = {
    copy: t('advancedSettings.video.encoderCopy'),
    h264: t('advancedSettings.video.encoderH264'),
    h265: t('advancedSettings.video.encoderH265'),
  };
  
  const qualityLabels = {
    original: t('advancedSettings.video.qualityOriginal'),
    high: t('advancedSettings.video.qualityHigh'),
    medium: t('advancedSettings.video.qualityMedium'),
    low: t('advancedSettings.video.qualityLow'),
  };
  
  const resolutionLabels = {
    original: t('advancedSettings.video.resolutionOriginal'),
    '2160p': t('advancedSettings.video.resolution2160p'),
    '1080p': t('advancedSettings.video.resolution1080p'),
    '720p': t('advancedSettings.video.resolution720p'),
    '480p': t('advancedSettings.video.resolution480p'),
    '360p': t('advancedSettings.video.resolution360p'),
  };
  
  const frameRateLabels = {
    original: t('advancedSettings.video.frameRateOriginal'),
    '60': t('advancedSettings.video.frameRate60'),
    '30': t('advancedSettings.video.frameRate30'),
    '24': t('advancedSettings.video.frameRate24'),
  };
  
  return (
    <div className="settings-section">
      <div className="settings-section__header">
        <span className="settings-icon">⚙️</span>
        <span className="settings-section__title">{t('advancedSettings.video.title')}</span>
      </div>
      <div className="settings-section__content">
        <div className="settings-row">
          <SelectField label={t('advancedSettings.video.encoder')} value={settings.encoder} options={['copy', 'h264', 'h265'] as const} labels={encoderLabels} onChange={(encoder: VideoEncoder) => onChange({ ...settings, encoder })} />
          <SelectField label={t('advancedSettings.video.quality')} value={settings.quality} options={['original', 'high', 'medium', 'low'] as const} labels={qualityLabels} onChange={(quality: VideoQuality) => onChange({ ...settings, quality })} disabled={!isReencoding} />
        </div>
        <div className="settings-row">
          <SelectField label={t('advancedSettings.video.resolution')} value={settings.resolution} options={['original', '2160p', '1080p', '720p', '480p', '360p'] as const} labels={resolutionLabels} onChange={(resolution: VideoResolution) => onChange({ ...settings, resolution })} disabled={!isReencoding} />
          <SelectField label={t('advancedSettings.video.frameRate')} value={settings.frameRate} options={['original', '60', '30', '24'] as const} labels={frameRateLabels} onChange={(frameRate: VideoFrameRate) => onChange({ ...settings, frameRate })} disabled={!isReencoding} />
        </div>
        {!isReencoding && <div className="settings-hint">{t('advancedSettings.video.hintFast')}</div>}
        {isReencoding && <div className="settings-hint settings-hint--warning">{t('advancedSettings.video.hintSlow')}</div>}
      </div>
    </div>
  );
};
