export const STORAGE_ROOT = 'storage' as const;
export const UPLOAD_DIR = `${STORAGE_ROOT}/uploads` as const;
export const OUTPUT_DIR = `${STORAGE_ROOT}/outputs` as const;
export const TASK_DIR = `${STORAGE_ROOT}/tasks` as const;

// 文件过期配置
export const DEFAULT_EXPIRY_HOURS = 1; // 成功任务1小时后过期
export const FAILED_TASK_EXPIRY_HOURS = 24; // 失败任务24小时后过期
export const ORPHANED_TASK_EXPIRY_HOURS = 48; // 其他状态任务48小时后过期

// 清理配置
export const CLEANUP_INTERVAL_MINUTES = 30; // 每30分钟执行一次清理
