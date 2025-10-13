/**
 * ZIP 打包下载 API
 * 职责：将多个转换完成的文件打包成 ZIP 并返回
 * 遵循单一职责原则（SRP）和 KISS 原则
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import archiver from 'archiver';
import { PassThrough, Readable } from 'stream';
import { join } from 'path';
import { existsSync } from 'fs';
import { OUTPUT_DIR } from '@/lib/config';
import { getTask } from '@/lib/tasks/task-manager';

export const runtime = 'nodejs';

/**
 * 格式化时间戳
 */
const formatTimestamp = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}-${hour}${minute}${second}`;
};

/**
 * POST /api/download-zip
 * 请求体：{ taskIds: string[] }
 * 返回：ZIP 文件流
 */
export const POST = async (request: Request) => {
  try {
    // ✅ Session 方案：验证 Session ID
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('sessionId')?.value;
    
    const body = await request.json();
    const { taskIds } = body as { taskIds: string[] };

    if (!Array.isArray(taskIds) || taskIds.length === 0) {
      return NextResponse.json({ error: '任务ID列表不能为空' }, { status: 400 });
    }

    console.log(`[ZIP下载] 📦 开始打包 ${taskIds.length} 个文件`);

    // 验证所有任务并收集文件路径
    const files: Array<{ path: string; name: string }> = [];
    const outputDir = join(process.cwd(), OUTPUT_DIR);

    for (const taskId of taskIds) {
      const task = await getTask(taskId);

      if (!task) {
        console.warn(`[ZIP下载] ⚠️ 任务不存在: ${taskId}`);
        continue;
      }

      if (task.status !== 'completed' || !task.outputFilename) {
        console.warn(`[ZIP下载] ⚠️ 任务未完成: ${taskId}`);
        continue;
      }
      
      // ✅ 验证 Session（新任务有 sessionId，旧任务兼容）
      if (task.sessionId && task.sessionId !== sessionId) {
        console.warn(`[ZIP下载] ⚠️ Session 不匹配: ${taskId}`);
        continue;
      }

      const filePath = join(outputDir, `${taskId}.mp4`);

      if (!existsSync(filePath)) {
        console.warn(`[ZIP下载] ⚠️ 文件不存在: ${filePath}`);
        continue;
      }

      // 使用原始文件名（去掉 .mkv 扩展名，加上 .mp4）
      const originalName = task.originalFilename.replace(/\.mkv$/i, '.mp4');
      files.push({ path: filePath, name: originalName });
    }

    if (files.length === 0) {
      return NextResponse.json({ error: '没有可下载的文件' }, { status: 404 });
    }

    console.log(`[ZIP下载] ✅ 找到 ${files.length} 个有效文件`);

    const archive = archiver('zip', {
      zlib: { level: 0 }, // 不压缩，速度最快
    });
    const passThrough = new PassThrough();

    archive.on('error', (error) => {
      console.error('[ZIP下载] ❌ 打包失败:', error);
      passThrough.destroy(error);
    });

    for (const file of files) {
      console.log('[ZIP下载] 📄 添加文件: ' + file.name);
      archive.file(file.path, { name: file.name });
    }

    archive.pipe(passThrough);

    archive.finalize().catch((error) => {
      console.error('[ZIP下载] ❌ finalize 失败:', error);
      passThrough.destroy(error);
    });

    console.log('[ZIP下载] 🎉 ZIP 打包开始');

    const zipFilename = 'converted-videos-' + formatTimestamp() + '.zip';
    const stream = Readable.toWeb(passThrough) as ReadableStream<Uint8Array>;

    return new Response(stream, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${zipFilename}"`,
      },
    });
  } catch (error) {
    console.error('[ZIP下载] ❌ 打包失败:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '打包失败' },
      { status: 500 }
    );
  }
};
