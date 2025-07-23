import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: '邮箱无效' }, { status: 400 });
    }
    await prisma.waitlistUser.create({
      data: { email },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error); // 新增：打印详细错误日志
    if ((error as any).code === 'P2002') {
      // 邮箱已存在
      return NextResponse.json({ error: '该邮箱已在等待列表中' }, { status: 409 });
    }
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
} 