/**
 * 转换服务
 * 职责：处理视频格式转换
 * 遵循单一职责原则（SRP）
 */

import { convertToMp4 } from './conversion/index';
import type { IConversionService } from './interfaces';
import type { AdvancedSettings } from '@/shared/advanced-settings';  // ✅ P1: 使用共享模块

/**
 * 转换服务实现
 */
export class ConversionService implements IConversionService {
  /**
   * 执行 MKV 到 MP4 的转换
   */
  async convert(inputPath: string, taskId: string, onProgress?: (progress: number) => void, settings?: AdvancedSettings): Promise<string> {  // ✨ 新增参数
    return await convertToMp4({ inputPath, taskId, onProgress, settings });  // ✨ 传递设置
  }
}

/**
 * 导出单例实例
 */
export const conversionService = new ConversionService();
