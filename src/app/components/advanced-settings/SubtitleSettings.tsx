import { SelectField } from './SelectField';
import type { SubtitleSettings as SS, SubtitleMode, SubtitleLanguage } from './types';
import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '@/lib/i18n';

// ✅ 修复无限循环：将常量移到组件外部
const DEFAULT_TRACK_OPTIONS: (string | number)[] = ['auto', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

interface SubtitleSettingsProps {
  settings: SS;
  onChange: (settings: SS) => void;
  taskId?: string; // ✅ 修复：使用任务 ID 而非文件名
}

export const SubtitleSettings = ({ settings, onChange, taskId }: SubtitleSettingsProps) => {
  const { t } = useTranslation();
  
  // 轨道选择启用条件：保留软字幕 或 烧录硬字幕（外挂字幕模式不需要轨道选择）
  const trackSelectionEnabled = settings.mode === 'keep' || settings.mode === 'burn';
  
  // ✅ P2-1: 语言选择启用条件：外挂字幕模式需要选择语言
  const languageSelectionEnabled = settings.mode === 'external-soft' || settings.mode === 'external';
  
  // 动态轨道探测状态
  const [trackOptions, setTrackOptions] = useState<(string | number)[]>(['auto']);
  const [trackLabels, setTrackLabels] = useState<Record<string | number, string>>({ auto: '' });
  const [isProbing, setIsProbing] = useState(false);

  // ✅ 使用 useMemo 避免每次渲染都创建新对象
  const defaultTrackLabels = useMemo(() => ({
    auto: t('advancedSettings.subtitle.trackAuto'),
    0: t('advancedSettings.subtitle.trackNumber', { number: '0' }),
    1: t('advancedSettings.subtitle.trackNumber', { number: '1' }), 
    2: t('advancedSettings.subtitle.trackNumber', { number: '2' }),
    3: t('advancedSettings.subtitle.trackNumber', { number: '3' }),
    4: t('advancedSettings.subtitle.trackNumber', { number: '4' }),
    5: t('advancedSettings.subtitle.trackNumber', { number: '5' }),
    6: t('advancedSettings.subtitle.trackNumber', { number: '6' }),
    7: t('advancedSettings.subtitle.trackNumber', { number: '7' }),
    8: t('advancedSettings.subtitle.trackNumber', { number: '8' }),
    9: t('advancedSettings.subtitle.trackNumber', { number: '9' }),
  }), [t]);

  // 探测字幕轨道
  useEffect(() => {
    if (!taskId) {
      // 没有上传文件时使用默认选项
      setTrackOptions(DEFAULT_TRACK_OPTIONS);
      setTrackLabels(defaultTrackLabels);
      return;
    }

    // 外挂字幕模式不需要轨道探测
    if (settings.mode === 'external' || settings.mode === 'external-soft') {
      setTrackOptions(['auto']);
      setTrackLabels({ auto: t('advancedSettings.subtitle.trackAuto') });
      return;
    }

    const probeSubtitleTracks = async () => {
      setIsProbing(true);
      try {
        const response = await fetch('/api/probe-subtitle-tracks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ taskId })  // ✅ 使用 taskId
        });

        if (response.ok) {
          const data = await response.json();
          setTrackOptions(data.trackOptions);
          setTrackLabels(data.trackLabels);
          console.log(`[字幕轨道探测] 发现 ${data.subtitleCount} 个字幕轨道`);
        } else {
          console.warn('[字幕轨道探测] 失败，使用默认选项');
          setTrackOptions(DEFAULT_TRACK_OPTIONS);
          setTrackLabels(defaultTrackLabels);
        }
      } catch (error) {
        console.error('[字幕轨道探测] 错误:', error);
        setTrackOptions(DEFAULT_TRACK_OPTIONS);
        setTrackLabels(defaultTrackLabels);
      } finally {
        setIsProbing(false);
      }
    };

    void probeSubtitleTracks();
  }, [taskId, settings.mode, t, defaultTrackLabels]); // ✅ 依赖正确的变量

  // 动态构建选项标签
  const modeLabels = {
    keep: t('advancedSettings.subtitle.modeKeep'),
    burn: t('advancedSettings.subtitle.modeBurn'),
    remove: t('advancedSettings.subtitle.modeRemove'),
    external: t('advancedSettings.subtitle.modeExternal'),
    'external-soft': t('advancedSettings.subtitle.modeExternalSoft'),
  };
  
  const languageLabels = {
    und: t('advancedSettings.subtitle.langUnd'),
    chi: t('advancedSettings.subtitle.langChi'),
    eng: t('advancedSettings.subtitle.langEng'),
    jpn: t('advancedSettings.subtitle.langJpn'),
    kor: t('advancedSettings.subtitle.langKor'),
    fre: t('advancedSettings.subtitle.langFre'),
    ger: t('advancedSettings.subtitle.langGer'),
    spa: t('advancedSettings.subtitle.langSpa'),
  };
  
  return (
    <div className="settings-section">
      <div className="settings-section__header">
        <span className="settings-icon">⚙️</span>
        <span className="settings-section__title">{t('advancedSettings.subtitle.title')}</span>
      </div>
      <div className="settings-section__content">
        <div className="settings-row">
          <SelectField label={t('advancedSettings.subtitle.mode')} value={settings.mode} options={['keep', 'burn', 'remove', 'external', 'external-soft'] as const} labels={modeLabels} onChange={(mode: SubtitleMode) => onChange({ ...settings, mode })} />
          <SelectField 
            label={`${t('advancedSettings.subtitle.track')}${isProbing ? t('advancedSettings.subtitle.trackProbing') : ''}${!trackSelectionEnabled ? t('advancedSettings.subtitle.trackDisabled') : ''}`}
            value={settings.trackIndex?.toString() ?? 'auto'} 
            options={trackOptions.map(String)} 
            labels={Object.fromEntries(Object.entries(trackLabels).map(([k, v]) => [String(k), v]))} 
            onChange={(value) => onChange({ ...settings, trackIndex: value === 'auto' ? undefined : Number(value) })} 
            disabled={!trackSelectionEnabled || isProbing} 
          />
        </div>
        <div className="settings-row">
          <SelectField 
            label={`${t('advancedSettings.subtitle.language')}${!languageSelectionEnabled ? t('advancedSettings.subtitle.languageDisabled') : ''}`}
            value={settings.language || 'und'} 
            options={['und', 'chi', 'eng', 'jpn', 'kor', 'fre', 'ger', 'spa'] as const} 
            labels={languageLabels} 
            onChange={(value: SubtitleLanguage) => onChange({ ...settings, language: value })} 
            disabled={!languageSelectionEnabled}
          />
        </div>
        {settings.mode === 'burn' && (
          <div className="settings-row settings-row--full">
            <div className="settings-hint">
              {t('advancedSettings.subtitle.hintBurn')}
            </div>
          </div>
        )}
        {(settings.mode === 'external' || settings.mode === 'external-soft') && (
          <div className="settings-row settings-row--full">
            <div className="select-field">
              <label className="select-field__label">{t('advancedSettings.subtitle.externalFile')}</label>
              <input type="file" accept=".srt,.ass" onChange={(e) => onChange({ ...settings, externalFile: e.target.files?.[0] || null })} className="file-input" />
              {settings.externalFile && <span className="file-name">📄 {settings.externalFile.name}</span>}
            </div>
          </div>
        )}
        {settings.mode === 'external-soft' && (
          <div className="settings-row settings-row--full">
            <div className="settings-hint">
              {t('advancedSettings.subtitle.hintExternalSoft')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
