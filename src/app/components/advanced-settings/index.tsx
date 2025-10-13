import { useState } from 'react';
import { VideoSettings } from './VideoSettings';
import { AudioSettings } from './AudioSettings';
import { SubtitleSettings } from './SubtitleSettings';
import type { AdvancedSettings as AdvancedSettingsType } from './types';
import { DEFAULT_ADVANCED_SETTINGS } from './types';
import { useTranslation } from '@/lib/i18n';

interface AdvancedSettingsProps {
  settings: AdvancedSettingsType;
  onChange: (settings: AdvancedSettingsType) => void;
  taskId?: string; // ✅ 任务 ID，用于字幕轨道探测
}

export const AdvancedSettings = ({ settings, onChange, taskId }: AdvancedSettingsProps) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="advanced-settings">
      <button className="advanced-settings__toggle" onClick={() => setIsExpanded(!isExpanded)} type="button">
        <span className="advanced-settings__toggle-icon">⚙️</span>
        <span className="advanced-settings__toggle-text">{t('advancedSettings.title')}</span>
        <span className={`advanced-settings__toggle-arrow ${isExpanded ? 'expanded' : ''}`}>▼</span>
      </button>
      {isExpanded && (
        <div className="advanced-settings__content">
          <VideoSettings settings={settings.video} onChange={(video) => onChange({ ...settings, video })} />
          <AudioSettings settings={settings.audio} onChange={(audio) => onChange({ ...settings, audio })} />
          <SubtitleSettings settings={settings.subtitle} onChange={(subtitle) => onChange({ ...settings, subtitle })} taskId={taskId} />
        </div>
      )}
    </div>
  );
};

export { DEFAULT_ADVANCED_SETTINGS };
export type { AdvancedSettings as AdvancedSettingsType } from './types';
