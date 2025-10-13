/**
 * Google Analytics Hook
 * 提供事件追踪功能
 */

'use client';

import { useCallback } from 'react';

// 扩展 Window 接口以包含 gtag
declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'js',
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
  }
}

interface EventParams {
  category?: string;
  label?: string;
  value?: number;
  [key: string]: string | number | boolean | undefined;
}

/**
 * Google Analytics Hook
 */
export function useAnalytics() {
  /**
   * 追踪事件
   */
  const trackEvent = useCallback(
    (eventName: string, params?: EventParams) => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', eventName, params);
        
        // 开发环境输出日志
        if (process.env.NODE_ENV === 'development') {
          console.log('[Analytics Event]', eventName, params);
        }
      }
    },
    []
  );

  /**
   * 追踪文件上传事件
   */
  const trackFileUpload = useCallback(
    (fileName: string, fileSize: number, fileType: string) => {
      trackEvent('file_upload', {
        category: 'File',
        label: fileName,
        value: Math.round(fileSize / 1024 / 1024), // MB
        file_type: fileType,
        file_size: fileSize,
      });
    },
    [trackEvent]
  );

  /**
   * 追踪批量文件上传事件
   */
  const trackBatchFileUpload = useCallback(
    (fileCount: number, totalSize: number) => {
      trackEvent('batch_file_upload', {
        category: 'File',
        label: `${fileCount} files`,
        value: fileCount,
        total_size: totalSize,
        total_size_mb: Math.round(totalSize / 1024 / 1024),
      });
    },
    [trackEvent]
  );

  /**
   * 追踪文件转换开始事件
   */
  const trackConversionStart = useCallback(
    (fileName: string, fileSize: number) => {
      trackEvent('conversion_start', {
        category: 'Conversion',
        label: fileName,
        value: Math.round(fileSize / 1024 / 1024),
        file_size: fileSize,
      });
    },
    [trackEvent]
  );

  /**
   * 追踪文件转换完成事件
   */
  const trackConversionComplete = useCallback(
    (fileName: string, duration: number) => {
      trackEvent('conversion_complete', {
        category: 'Conversion',
        label: fileName,
        value: Math.round(duration / 1000), // 秒
        duration_ms: duration,
        duration_seconds: Math.round(duration / 1000),
      });
    },
    [trackEvent]
  );

  /**
   * 追踪文件转换失败事件
   */
  const trackConversionError = useCallback(
    (fileName: string, errorMessage?: string) => {
      trackEvent('conversion_error', {
        category: 'Conversion',
        label: fileName,
        error_message: errorMessage || 'Unknown error',
      });
    },
    [trackEvent]
  );

  /**
   * 追踪文件下载事件
   */
  const trackFileDownload = useCallback(
    (fileName: string, fileSize: number) => {
      trackEvent('file_download', {
        category: 'File',
        label: fileName,
        value: Math.round(fileSize / 1024 / 1024), // MB
        file_size: fileSize,
      });
    },
    [trackEvent]
  );

  /**
   * 追踪批量下载事件
   */
  const trackBatchDownload = useCallback(
    (fileCount: number, totalSize: number) => {
      trackEvent('batch_download', {
        category: 'File',
        label: `${fileCount} files`,
        value: fileCount,
        total_size: totalSize,
        total_size_mb: Math.round(totalSize / 1024 / 1024),
      });
    },
    [trackEvent]
  );

  /**
   * 追踪语言切换事件
   */
  const trackLanguageChange = useCallback(
    (fromLanguage: string, toLanguage: string) => {
      trackEvent('language_change', {
        category: 'Settings',
        label: `${fromLanguage} -> ${toLanguage}`,
        from_language: fromLanguage,
        to_language: toLanguage,
      });
    },
    [trackEvent]
  );

  /**
   * 追踪错误事件
   */
  const trackError = useCallback(
    (errorMessage: string, errorLocation?: string) => {
      trackEvent('error', {
        category: 'Error',
        label: errorMessage,
        error_location: errorLocation || 'unknown',
      });
    },
    [trackEvent]
  );

  return {
    trackEvent,
    trackFileUpload,
    trackBatchFileUpload,
    trackConversionStart,
    trackConversionComplete,
    trackConversionError,
    trackFileDownload,
    trackBatchDownload,
    trackLanguageChange,
    trackError,
  };
}
