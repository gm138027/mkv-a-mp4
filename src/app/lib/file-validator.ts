/**
 * 文件验证工具
 * 遵循 KISS 原则：简单的验证逻辑，单一职责
 * 
 * ✅ 文件大小限制（基于实际测试结果）
 * - 硬限制：单文件 1.6GB（超过拒绝上传）
 * - UI建议：1.5GB（界面提示文字，给用户留余量）
 * - 无总大小限制：串行处理，只有单个文件大小影响转换成功率
 * - 测试数据：
 *   - 1.8GB：转换失败 ❌
 *   - 1.6GB：转换成功 ✅（耗时约1分钟）
 *   - ≤1GB：转换成功 ✅（几秒完成）
 */

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  warning?: string;
}

const MAX_FILES = 10; // 最大文件数量
const MAX_FILE_SIZE = Math.floor(1.6 * 1024 * 1024 * 1024); // 1.6GB（硬限制，精确值）

/**
 * 格式化文件大小
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

/**
 * 验证文件列表
 * 单一职责：只负责验证，不负责其他逻辑
 * 
 * Returns error/warning keys for i18n translation
 */
export const validateFiles = (files: File[]): FileValidationResult & { errorKey?: string; errorParams?: Record<string, string | number> } => {
  // 验证文件数量
  if (files.length === 0) {
    return { valid: false, errorKey: 'errors.selectAtLeastOneFile', error: 'Please select at least one file' };
  }

  if (files.length > MAX_FILES) {
    return { 
      valid: false, 
      errorKey: 'errors.maxFilesExceeded',
      errorParams: { max: MAX_FILES },
      error: `Maximum ${MAX_FILES} files allowed` 
    };
  }

  // 验证文件类型
  const invalidFiles = files.filter((f) => !f.name.toLowerCase().endsWith('.mkv'));
  if (invalidFiles.length > 0) {
    const fileList = invalidFiles.map((f) => f.name).join(', ');
    return {
      valid: false,
      errorKey: 'errors.unsupportedFormat',
      errorParams: { fileList },
      error: `Only MKV format is supported, incorrect file format: ${fileList}`,
    };
  }

  // ✅ 验证单文件大小（硬限制：1.6GB）
  const oversizedFiles = files.filter((f) => f.size > MAX_FILE_SIZE);
  if (oversizedFiles.length > 0) {
    const fileList = oversizedFiles.map((f) => `${f.name} (${formatFileSize(f.size)})`).join(', ');
    return {
      valid: false,
      errorKey: 'errors.fileTooLarge',
      errorParams: { maxSize: formatFileSize(MAX_FILE_SIZE), fileList },
      error: `Individual file cannot exceed ${formatFileSize(MAX_FILE_SIZE)}.\nFiles too large: ${fileList}\n\nSuggestion: Please select files under 1.6GB.`,
    };
  }

  // ✅ 验证通过（串行处理，无需限制总大小）
  return { valid: true };
};

