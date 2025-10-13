import { mkdir } from 'fs/promises';
import { mkdirSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * 确保目录存在，如果不存在则创建（异步方法，用于运行时）
 * @param dir 相对或绝对路径
 */
export const ensureDir = async (dir: string): Promise<void> => {
  await mkdir(dir, { recursive: true });
};

/**
 * 确保目录存在，如果不存在则创建（同步方法，用于初始化）
 * @param dir 相对于项目根目录的路径
 */
export const ensureDirSync = (dir: string): void => {
  const fullPath = join(process.cwd(), dir);
  if (!existsSync(fullPath)) {
    mkdirSync(fullPath, { recursive: true });
    console.log(`✅ 已创建目录: ${dir}`);
  }
};

/**
 * 初始化所有必需的存储目录（同步方法，确保在任何异步操作前完成）
 */
export const initializeStorageDirs = (): void => {
  const dirs = ['storage', 'storage/uploads', 'storage/outputs', 'storage/tasks'];
  
  for (const dir of dirs) {
    ensureDirSync(dir);
  }
  
  console.log('✅ 存储目录初始化完成');
};
