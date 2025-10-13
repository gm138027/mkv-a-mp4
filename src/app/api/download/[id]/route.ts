import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
import { join } from 'path';
import { Readable } from 'stream';
import { getTask } from '@/lib/tasks/task-manager';

export const runtime = 'nodejs';

const buildFilename = (original: string) => {
  const base = original.replace(/\.[^.]+$/, '');
  return base ? `${base}.mp4` : `${original}.mp4`;
};

export const GET = async (_request: Request, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  
  // ✅ Session 方案：验证 Session ID
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('sessionId')?.value;
  
  const task = await getTask(id);

  if (!task || task.status !== 'completed' || !task.outputFilename) {
    return NextResponse.json({ error: '文件尚未生成或任务不存在' }, { status: 404 });
  }
  
  // ✅ 验证 Session （新任务有 sessionId，旧任务兼容）
  if (task.sessionId && task.sessionId !== sessionId) {
    console.warn(`[下载] ⚠️ Session 不匹配: ${id}`);
    return NextResponse.json({ error: '无权访问此文件' }, { status: 403 });
  }

  const absolutePath = join(process.cwd(), task.outputFilename);

  try {
    await stat(absolutePath);
  } catch {
    return NextResponse.json({ error: '文件不存在' }, { status: 404 });
  }

  const stream = createReadStream(absolutePath);
  const webStream = Readable.toWeb(stream) as ReadableStream<Uint8Array>;
  const filename = buildFilename(task.originalFilename);
  const headers = new Headers({
    'Content-Type': 'video/mp4',
    'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
  });

  return new Response(webStream, {
    headers,
  });
};
