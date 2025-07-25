import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

interface PrismaError extends Error {
 code?: string;
 meta?: Record<string, unknown>;
}

function isPrismaError(error: unknown): error is PrismaError {
 return error instanceof Error && 'code' in error;
}

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
   console.error(error);
   
   if (isPrismaError(error) && error.code === 'P2002') {
     return NextResponse.json({ error: '该邮箱已在等待列表中' }, { status: 409 });
   }

   return NextResponse.json({ error: '服务器错误' }, { status: 500 });
 }
}