'use client';

// import { useState } from 'react';
import { StageRenderer } from '@/app/components/stage-renderer';
import { useStageState } from '@/app/hooks/use-stage-state';
import { useUploader } from '@/app/hooks/uploader';
// 🔒 [封存] 高级功能暂时封存，等待服务器版本
// import { DEFAULT_ADVANCED_SETTINGS, type AdvancedSettingsType } from '@/app/components/advanced-settings';
import { useTranslation } from '@/lib/i18n';

const ConverterClient = () => {
  const { t } = useTranslation();
  const { state, dispatch } = useStageState();
  const { setInputRef, triggerFilePicker, handleFileSelected, startUpload, resetInternal, removePendingFile } =
    useUploader(state, dispatch);
  
  // 🔒 [封存] 高级设置状态（浏览器版本暂不使用）
  // const [advancedSettings, setAdvancedSettings] = useState<AdvancedSettingsType>(DEFAULT_ADVANCED_SETTINGS);

  const handleAddMore = () => {
    triggerFilePicker();
  };

  const handleConvert = () => {
    // 🔒 [封存] 外挂字幕校验（浏览器版本暂不使用）
    // if ((advancedSettings.subtitle.mode === 'external' || advancedSettings.subtitle.mode === 'external-soft') && !advancedSettings.subtitle.externalFile) {
    //   alert(t('errors.subtitleRequired'));
    //   return;
    // }
    
    // ✅ 浏览器版本：使用默认设置（Stream Copy，保留所有）
    startUpload((errorKey: string) => {
      alert(t(errorKey));
    });
  };

  const handleConvertMore = () => {
    resetInternal();
    dispatch({ type: 'RESET' });
  };

  const handleRemove = (id: string) => {
    // ✅ 同步清理：从 state.videos 和 pendingFiles 中删除
    dispatch({ type: 'REMOVE_VIDEO', id });
    removePendingFile(id);  // 从 pendingFiles Map 中删除
    
    if (state.videos.length <= 1) {
      resetInternal();
      dispatch({ type: 'RESET' });
    }
  };

  return (
    <div className="browser-converter">
      <input
        ref={setInputRef}
        type="file"
        accept=".mkv"
        multiple
        className="hidden"
        onChange={handleFileSelected}
      />

      {/* 🔒 [封存] 以下 props 已移除（浏览器版本暂不使用）:
          - advancedSettings
          - onAdvancedSettingsChange  
          - taskId
      */}
      <StageRenderer
        state={state}
        activeStage={state.activeStage}
        onPickFile={triggerFilePicker}
        onAddMore={handleAddMore}
        onConvert={handleConvert}
        onConvertMore={handleConvertMore}
        onRemove={handleRemove}
      />
    </div>
  );
};

export default ConverterClient;
