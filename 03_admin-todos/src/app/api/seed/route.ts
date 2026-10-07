// snippet rag 
import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server'

export async function GET(request: Request) {
    
    prisma.todo.create({
        data: {
            title: 'Seeded Todo',
            completed: false,
        },
    });

  return NextResponse.json({ message: 'Hello from the seed route!' });
}