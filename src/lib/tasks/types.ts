import type { AdvancedSettings } from '@/shared/advanced-settings';  // ✅ P1: 使用共享模块
export type TaskStatus = 'queued' | 'processing' | 'completed' | 'failed';

export interface TaskRecord {
  id: string;
  originalFilename: string;
  uploadFilename: string;
  status: TaskStatus;
  progress: number;
  outputFilename?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  settings?: AdvancedSettings;
  sessionId?: string;  // ✅ Session ID（真正的权限控制）
}

export interface CreateTaskInput {
  id: string;
  originalFilename: string;
  settings?: AdvancedSettings;
  sessionId?: string;  // ✅ Session ID
}

export interface UpdateTaskInput {
  status: TaskStatus;
  message?: string;
  outputFilename?: string;
  expiresAt?: string;
}
