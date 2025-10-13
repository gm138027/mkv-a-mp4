import { NextResponse } from 'next/server';
import { getTask } from '@/lib/tasks/task-manager';

export const runtime = 'nodejs';

export const GET = async (_request: Request, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const task = await getTask(id);

  if (!task) {
    return NextResponse.json({ error: '任务不存在' }, { status: 404 });
  }

  return NextResponse.json(task);
};
