import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { join } from 'path';
import { access } from 'fs/promises';
import { UPLOAD_DIR } from '@/lib/config';

export const runtime = 'nodejs';

export const POST = async (request: Request): Promise<Response> => {
  try {
    const { taskId } = await request.json();
    
    if (!taskId) {
      return NextResponse.json({ error: '缺少任务ID参数' }, { status: 400 });
    }

    // ✅ 修复：使用任务 ID 而非原始文件名
    // 1. 验证任务 ID 格式（UUID）
    if (!/^[a-f0-9-]{36}$/i.test(taskId)) {
      return NextResponse.json({ error: '无效的任务ID格式' }, { status: 400 });
    }

    // 2. 直接构造文件路径（文件保存为 <taskId>.mkv）
    const inputPath = join(process.cwd(), UPLOAD_DIR, `${taskId}.mkv`);
    
    // 检查文件是否存在
    try {
      await access(inputPath);
    } catch {
      console.error(`文件不存在: ${inputPath}`);
      return NextResponse.json({ error: '文件不存在' }, { status: 404 });
    }
    
    // 使用 ffprobe 探测字幕轨道
    const ffprobe = spawn('ffprobe', [
      '-v', 'quiet',
      '-show_streams',
      '-select_streams', 's', // 只选择字幕流
      '-of', 'json',
      inputPath // 直接传裸路径，让spawn自行转义
    ]);

    let output = '';
    let error = '';

    ffprobe.stdout.on('data', (data) => {
      output += data.toString();
    });

    ffprobe.stderr.on('data', (data) => {
      error += data.toString();
    });

    return new Promise((resolve) => {
      ffprobe.on('close', (code) => {
        if (code !== 0) {
          console.error('ffprobe 错误:', error);
          console.error('ffprobe 退出码:', code);
          console.error('输入文件:', inputPath);
          resolve(NextResponse.json({ error: `探测字幕轨道失败: ${error || '未知错误'}` }, { status: 500 }));
          return;
        }

        try {
          const result = JSON.parse(output);
          const subtitleStreams = result.streams || [];
          
          // 构建轨道选项
          const trackOptions: (string | number)[] = ['auto'];
          const trackLabels: Record<string | number, string> = { auto: '自动选择' };
          
          subtitleStreams.forEach((stream: { index?: number; tags?: { language?: string; title?: string }; codec_name?: string }, index: number) => {
            const trackIndex = stream.index || index;
            const language = stream.tags?.language || '未知';
            const title = stream.tags?.title || '';
            const codec = stream.codec_name || '未知';
            
            trackOptions.push(trackIndex);
            trackLabels[trackIndex] = `轨道 ${trackIndex} (${language}${title ? ` - ${title}` : ''} - ${codec})`;
          });

          resolve(NextResponse.json({ 
            trackOptions, 
            trackLabels,
            subtitleCount: subtitleStreams.length 
          }));
        } catch (parseError) {
          console.error('解析 ffprobe 输出失败:', parseError);
          resolve(NextResponse.json({ error: '解析字幕轨道信息失败' }, { status: 500 }));
        }
      });
    });

  } catch (error) {
    console.error('探测字幕轨道 API 错误:', error);
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 });
  }
};
