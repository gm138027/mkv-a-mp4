/**
 * i18n 类型定义
 * 用于多语言支持的类型系统
 */

/**
 * 支持的语言代码
 */
export type Locale = 'es' | 'en' | 'ja' | 'fr' | 'de';

/**
 * 语言配置
 */
export interface LocaleConfig {
  code: Locale;
  name: string;
  nativeName: string;
}

/**
 * 支持的语言列表
 */
export const SUPPORTED_LOCALES: LocaleConfig[] = [
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
];

/**
 * 默认语言
 */
export const DEFAULT_LOCALE: Locale = 'es';

/**
 * 翻译消息类型（主页 common.json）
 */
export interface Messages {
  meta: {
    title: string;
    description: string;
    keywords: string;
  };
  common: {
    button: {
      selectFile: string;
      addMore: string;
      convert: string;
      convertMore: string;
      download: string;
      downloadAll: string;
    };
    label: {
      videoPlaceholder: string;
      removeVideo: string;
      downloadFile: string;
    };
  };
  upload: {
    sizeHint: string;
  };
  video: {
    status: {
      idle: string;
      ready: string;
      reading: string;
      processing: string;
      completed: string;
      failed: string;
    };
  };
  advancedSettings: {
    title: string;
    video: {
      title: string;
      encoder: string;
      encoderCopy: string;
      encoderH264: string;
      encoderH265: string;
      quality: string;
      qualityOriginal: string;
      qualityHigh: string;
      qualityMedium: string;
      qualityLow: string;
      resolution: string;
      resolutionOriginal: string;
      resolution2160p: string;
      resolution1080p: string;
      resolution720p: string;
      resolution480p: string;
      resolution360p: string;
      frameRate: string;
      frameRateOriginal: string;
      frameRate60: string;
      frameRate30: string;
      frameRate24: string;
      hintFast: string;
      hintSlow: string;
    };
    audio: {
      title: string;
      encoder: string;
      encoderCopy: string;
      encoderAac: string;
      encoderMp3: string;
      quality: string;
      qualityOriginal: string;
      qualityHigh: string;
      qualityMedium: string;
      qualityLow: string;
      channels: string;
      channelsOriginal: string;
      channelsStereo: string;
      channelsMono: string;
    };
    subtitle: {
      title: string;
      mode: string;
      modeKeep: string;
      modeBurn: string;
      modeRemove: string;
      modeExternal: string;
      modeExternalSoft: string;
      track: string;
      trackProbing: string;
      trackDisabled: string;
      trackAuto: string;
      trackNumber: string;
      language: string;
      languageDisabled: string;
      langUnd: string;
      langChi: string;
      langEng: string;
      langJpn: string;
      langKor: string;
      langFre: string;
      langGer: string;
      langSpa: string;
      externalFile: string;
      hintBurn: string;
      hintExternalSoft: string;
    };
  };
  errors: {
    subtitleRequired: string;
    downloadFailed: string;
    selectAtLeastOne: string;
    invalidVideoFile: string;
    fileValidationFailed: string;
    selectAtLeastOneFile: string;
    maxFilesExceeded: string;
    unsupportedFormat: string;
    fileTooLarge: string;
    outOfMemory: string;
    fileReadFailed: string;
    conversionFailed: string;
  };
  footer: {
    copyright: string;
    tech: string;
    privacyPolicy: string;
    termsOfService: string;
  };
  languageSwitcher: {
    ariaLabel: string;
  };
  navigation: {
    backToHome: string;
  };
  layout: {
    leftAdLabel: string;
    rightAdLabel: string;
  };
  browserConverter: {
    unsupportedBrowser: string;
    unsupportedDescription1: string;
    unsupportedDescription2: string;
    dragDropHere: string;
    loadingEngine: string;
    orClickBelow: string;
    privacyNote: string;
    statsTotal: string;
    statsConverting: string;
    statsCompleted: string;
    statsFailed: string;
    downloadAllButton: string;
    clearButton: string;
    statusIdle: string;
    statusLoading: string;
    statusReading: string;
    statusConverting: string;
    statusCompleted: string;
    statusFailed: string;
    downloadTitle: string;
    removeTitle: string;
    duration: string;
    toggleLogsShow: string;
    toggleLogsHide: string;
    logs: string;
  };
  hero: {
    title: string;
    subtitle: string;
    description: string;
    cta: string;
  };
  features: {
    title: string;
    items: Array<{
      title: string;
      description: string;
    }>;
  };
  howTo: {
    title: string;
    steps: Array<{
      title: string;
      description: string;
    }>;
  };
  tips: {
    title: string;
    items: Array<{
      title: string;
      description: string;
    }>;
  };
  alternativeMethods: {
    title: string;
    items: Array<{
      title: string;
      description: string;
    }>;
  };
  useCases: {
    title: string;
    items: Array<{
      title: string;
      description: string;
    }>;
  };
  faq: {
    title: string;
    items: Array<{
      question: string;
      answer: string;
    }>;
  };
  structuredData: {
    howTo: {
      name: string;
      step1: string;
      step2: string;
      step3: string;
      step4: string;
    };
  };
}

/**
 * 翻译函数类型
 */
export type TranslateFunction = (key: string, variables?: Record<string, string>) => string;
