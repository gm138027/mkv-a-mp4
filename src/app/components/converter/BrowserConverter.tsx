/**
 * 浏览器端视频转换器
 * 使用 ffmpeg.wasm 在浏览器中转换视频
 * 
 * ✅ 100% 隐私：文件从不上传到服务器
 * ✅ 免费：无需服务器成本
 * ✅ 快速：直接复制流（Stream Copy）只需几秒
 */

'use client';

import { useState, useCallback } from 'react';
import { useFFmpeg } from '@/lib/ffmpeg/useFFmpeg';
import type { VideoTask } from '@/lib/ffmpeg/types';
import { useTranslation } from '@/lib/i18n';

export default function BrowserConverter() {
  const { t } = useTranslation();
  const {
    tasks,
    isSupported,
    ffmpegLoaded,
    stats,
    addTask,
    downloadTask,
    removeTask,
    downloadAll,
    clearAll,
  } = useFFmpeg();

  const [isDragging, setIsDragging] = useState(false);

  // 文件选择处理
  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const validFiles = Array.from(files).filter(file => {
      const isVideo = file.type.startsWith('video/') || file.name.endsWith('.mkv');
      if (!isVideo) {
        alert(t('errors.invalidVideoFile', { fileName: file.name }));
      }
      return isVideo;
    });

    validFiles.forEach(file => addTask(file));
  }, [addTask, t]);

  // 拖放处理
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  // 浏览器不支持
  if (!isSupported) {
    return (
      <div className="converter-error">
        <h2>❌ {t('browserConverter.unsupportedBrowser')}</h2>
        <p>{t('browserConverter.unsupportedDescription1')}</p>
        <p>{t('browserConverter.unsupportedDescription2')}</p>
      </div>
    );
  }

  return (
    <div className="browser-converter">
      {/* 文件上传区 */}
      <div
        className={`upload-zone ${isDragging ? 'dragging' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="upload-zone__content">
          <div className="upload-zone__icon">📁</div>
          <h3 className="upload-zone__title">
            {ffmpegLoaded ? t('browserConverter.dragDropHere') : t('browserConverter.loadingEngine')}
          </h3>
          <p className="upload-zone__subtitle">
            {t('browserConverter.orClickBelow')}
          </p>
          <label className="upload-zone__button">
            <input
              type="file"
              multiple
              accept="video/*,.mkv"
              onChange={(e) => handleFileSelect(e.target.files)}
              style={{ display: 'none' }}
              disabled={!ffmpegLoaded}
            />
            {t('common.button.selectFile')}
          </label>
          <p className="upload-zone__note">
            {t('browserConverter.privacyNote')}
          </p>
        </div>
      </div>

      {/* 统计信息 */}
      {stats.total > 0 && (
        <div className="converter-stats">
          <div className="stat-item">
            <span className="stat-label">{t('browserConverter.statsTotal')}</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">{t('browserConverter.statsConverting')}</span>
            <span className="stat-value">{stats.converting}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">{t('browserConverter.statsCompleted')}</span>
            <span className="stat-value">{stats.completed}</span>
          </div>
          {stats.failed > 0 && (
            <div className="stat-item stat-item--error">
              <span className="stat-label">{t('browserConverter.statsFailed')}</span>
              <span className="stat-value">{stats.failed}</span>
            </div>
          )}
          {stats.completed > 1 && (
            <button className="btn-download-all" onClick={downloadAll}>
              {t('browserConverter.downloadAllButton')}
            </button>
          )}
          {stats.total > 0 && (
            <button className="btn-clear-all" onClick={clearAll}>
              {t('browserConverter.clearButton')}
            </button>
          )}
        </div>
      )}

      {/* 任务列表 */}
      {tasks.length > 0 && (
        <div className="tasks-list">
          {tasks.map((task) => (
            <VideoTaskCard
              key={task.id}
              task={task}
              onDownload={() => downloadTask(task.id)}
              onRemove={() => removeTask(task.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * 视频任务卡片
 */
function VideoTaskCard({
  task,
  onDownload,
  onRemove,
}: {
  task: VideoTask;
  onDownload: () => void;
  onRemove: () => void;
}) {
  const { t } = useTranslation();
  const [showLogs, setShowLogs] = useState(false);

  const statusEmoji = {
    idle: '⏸️',
    loading: '⏳',
    reading: '📖',
    converting: '⚙️',
    completed: '✅',
    failed: '❌',
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      idle: 'statusIdle',
      loading: 'statusLoading',
      reading: 'statusReading',
      converting: 'statusConverting',
      completed: 'statusCompleted',
      failed: 'statusFailed',
    };
    return t(`browserConverter.${statusMap[status]}`);
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m${remainingSeconds}s`;
  };

  return (
    <div className={`task-card task-card--${task.status}`}>
      <div className="task-card__header">
        <div className="task-card__info">
          <span className="task-card__emoji">{statusEmoji[task.status]}</span>
          <div>
            <div className="task-card__filename">{task.file.name}</div>
            <div className="task-card__meta">
              {(task.file.size / (1024 * 1024)).toFixed(2)} MB • {getStatusText(task.status)}
            </div>
          </div>
        </div>
        <div className="task-card__actions">
          {task.status === 'completed' && (
            <button className="btn-icon btn-download" onClick={onDownload} title={t('browserConverter.downloadTitle')}>
              📥
            </button>
          )}
          <button className="btn-icon btn-remove" onClick={onRemove} title={t('browserConverter.removeTitle')}>
            ✖️
          </button>
        </div>
      </div>

      {/* 进度条 */}
      {(task.status === 'converting' || task.status === 'loading') && (
        <div className="task-card__progress">
          <div className="progress-bar">
            <div 
              className="progress-bar__fill" 
              style={{ width: `${task.progress}%` }}
            />
          </div>
          <div className="progress-text">{task.progress}%</div>
        </div>
      )}

      {/* 完成信息 */}
      {task.status === 'completed' && task.completedAt && (
        <div className="task-card__duration">
          {t('browserConverter.duration', { time: formatDuration(task.completedAt - task.createdAt) })}
        </div>
      )}

      {/* 错误信息 */}
      {task.status === 'failed' && task.error && (
        <div className="task-card__error">
          ❌ {task.error}
        </div>
      )}

      {/* 日志 */}
      {task.logs.length > 0 && (
        <div className="task-card__logs">
          <button 
            className="btn-toggle-logs"
            onClick={() => setShowLogs(!showLogs)}
          >
            {showLogs ? t('browserConverter.toggleLogsHide') : t('browserConverter.toggleLogsShow')} {t('browserConverter.logs')} ({task.logs.length})
          </button>
          {showLogs && (
            <div className="logs-content">
              {task.logs.map((log, index) => (
                <div key={index} className="log-line">{log}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
