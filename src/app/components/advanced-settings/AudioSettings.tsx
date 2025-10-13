import { SelectField } from './SelectField';
import type { AudioSettings as AS, AudioEncoder, AudioQuality, AudioChannels } from './types';
import { useTranslation } from '@/lib/i18n';

interface AudioSettingsProps {
  settings: AS;
  onChange: (settings: AS) => void;
}

export const AudioSettings = ({ settings, onChange }: AudioSettingsProps) => {
  const { t } = useTranslation();
  const isReencoding = settings.encoder !== 'copy';
  
  // 动态构建选项标签
  const encoderLabels = {
    copy: t('advancedSettings.audio.encoderCopy'),
    aac: t('advancedSettings.audio.encoderAac'),
    mp3: t('advancedSettings.audio.encoderMp3'),
  };
  
  const qualityLabels = {
    original: t('advancedSettings.audio.qualityOriginal'),
    high: t('advancedSettings.audio.qualityHigh'),
    medium: t('advancedSettings.audio.qualityMedium'),
    low: t('advancedSettings.audio.qualityLow'),
  };
  
  const channelsLabels = {
    original: t('advancedSettings.audio.channelsOriginal'),
    stereo: t('advancedSettings.audio.channelsStereo'),
    mono: t('advancedSettings.audio.channelsMono'),
  };
  
  return (
    <div className="settings-section">
      <div className="settings-section__header">
        <span className="settings-icon">⚙️</span>
        <span className="settings-section__title">{t('advancedSettings.audio.title')}</span>
      </div>
      <div className="settings-section__content">
        <div className="settings-row">
          <SelectField label={t('advancedSettings.audio.encoder')} value={settings.encoder} options={['copy', 'aac', 'mp3'] as const} labels={encoderLabels} onChange={(encoder: AudioEncoder) => onChange({ ...settings, encoder })} />
          <SelectField label={t('advancedSettings.audio.quality')} value={settings.quality} options={['original', 'high', 'medium', 'low'] as const} labels={qualityLabels} onChange={(quality: AudioQuality) => onChange({ ...settings, quality })} disabled={!isReencoding} />
        </div>
        <div className="settings-row">
          <SelectField label={t('advancedSettings.audio.channels')} value={settings.channels} options={['original', 'stereo', 'mono'] as const} labels={channelsLabels} onChange={(channels: AudioChannels) => onChange({ ...settings, channels })} disabled={!isReencoding} />
        </div>
      </div>
    </div>
  );
};
