import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createConversionTask } from '@/lib/tasks/task-manager';
import type { AdvancedSettings } from '@/shared/advanced-settings';
import { randomUUID } from 'crypto';
import fs from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

// ✅ P0修复：字幕文件后缀白名单
const ALLOWED_SUBTITLE_EXTENSIONS = ['.srt', '.ass', '.ssa', '.vtt'];

export const POST = async (request: Request) => {
  // ✅ Session 方案：读取现有 Session ID
  const cookieStore = await cookies();
  let sessionId = cookieStore.get('sessionId')?.value;
  const isNewSession = !sessionId;
  
  if (!sessionId) {
    sessionId = randomUUID();
    console.log('[Upload API] 🆔 创建新 Session:', sessionId);
  } else {
    console.log('[Upload API] 🆔 使用现有 Session:', sessionId);
  }
  
  const formData = await request.formData();
  const file = formData.get('file');
  const settingsJson = formData.get('settings');
  const subtitleFile = formData.get('subtitleFile');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: '文件缺失或格式不正确' }, { status: 400 });
  }

  // ✅ P2修复：服务端视频文件验证
  const videoName = file.name.toLowerCase();
  if (!videoName.endsWith('.mkv')) {
    return NextResponse.json({ error: '仅支持 MKV 格式' }, { status: 400 });
  }

  // 文件大小验证（可选，防止异常大文件）
  const MAX_FILE_SIZE = 10 * 1024 * 1024 * 1024; // 10GB
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ 
      error: `文件过大，最大支持 10GB，当前文件: ${(file.size / (1024 * 1024 * 1024)).toFixed(2)}GB` 
    }, { status: 400 });
  }

  // ✨ 解析设置
  let settings: AdvancedSettings | undefined;
  let preGeneratedTaskId: string | undefined;  // ✅ 预生成任务ID
  
  if (settingsJson && typeof settingsJson === 'string') {
    try {
      settings = JSON.parse(settingsJson);
      
      // ✨ 校验外挂字幕文件
      if (settings && (settings.subtitle.mode === 'external' || settings.subtitle.mode === 'external-soft')) {
        if (!subtitleFile || !(subtitleFile instanceof File)) {
          return NextResponse.json({ error: '未选择外挂字幕文件' }, { status: 400 });
        }
      }

      // ✅ P0修复：处理外挂字幕文件 - 使用任务ID命名
      if (settings && (settings.subtitle.mode === 'external' || settings.subtitle.mode === 'external-soft') && subtitleFile instanceof File) {
        try {
          // ✅ P0修复：预生成任务ID，确保字幕文件名与任务ID一致
          preGeneratedTaskId = randomUUID();
          const uploadDir = path.join(process.cwd(), 'storage', 'uploads');
          
          // ✅ P1修复：校验字幕文件后缀
          const subtitleName = subtitleFile.name.toLowerCase();
          const isValidExtension = ALLOWED_SUBTITLE_EXTENSIONS.some(ext => 
            subtitleName.endsWith(ext)
          );
          
          if (!isValidExtension) {
            return NextResponse.json({ 
              error: `不支持的字幕格式，仅支持: ${ALLOWED_SUBTITLE_EXTENSIONS.join(', ')}` 
            }, { status: 400 });
          }
          
          const subtitleExtension = subtitleName.split('.').pop() || 'srt';
          // ✅ P0修复：使用任务ID而非随机ID
          const subtitlePath = path.join(uploadDir, `subtitle_${preGeneratedTaskId}.${subtitleExtension}`);
          
          // 确保上传目录存在
          await fs.mkdir(uploadDir, { recursive: true });
          
          // 将字幕文件保存到磁盘
          // ✅ P2修复：去掉 'utf-8' 选项，使用默认二进制写入，避免破坏非 UTF-8 编码
          const subtitleBuffer = await subtitleFile.arrayBuffer();
          await fs.writeFile(subtitlePath, Buffer.from(subtitleBuffer));
          
          // ✅ P1修复：只存储路径，移除伪File对象
          settings.subtitle.externalFilePath = subtitlePath;
          delete settings.subtitle.externalFile;  // 不再序列化File对象
          
          console.log(`[Upload API] ✅ 外挂字幕文件已保存: ${subtitlePath}`);
          console.log(`[Upload API] ✅ 使用任务ID: ${preGeneratedTaskId}`);
        } catch (error) {
          console.error('[Upload API] 保存外挂字幕文件失败:', error);
          return NextResponse.json({ error: '保存外挂字幕文件失败' }, { status: 500 });
        }
      }
      console.log('[Upload API] 接收到高级设置:', settings);
    } catch (error) {
      console.error('[Upload API] 解析设置失败:', error);
    }
  }

  // ✅ P0修复：传递预生成的任务ID
  // ✅ Session：传递 sessionId
  const task = await createConversionTask(file, settings, preGeneratedTaskId, sessionId);

  // ✅ 修复：通过 NextResponse 设置 Cookie
  const response = NextResponse.json({ 
    taskId: task.id,
    uploadFilename: task.uploadFilename
  });
  
  // ✅ 关键：只有新 Session 才设置 Cookie
  if (isNewSession) {
    response.cookies.set('sessionId', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 天
    });
    console.log('[Upload API] 🍪 设置 Cookie: sessionId =', sessionId);
  }
  
  return response;
};
