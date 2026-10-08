import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server'

export async function GET(request: Request, { params: segments }: { params: { id: string } }) {
    
    console.log({url: request.url})
    console.log({segments})

    /* get todo by id */
    /* const todo = await prisma.todo.findUnique({
        where: {
            id: segments.id,
        },
    }); */
    return NextResponse.json({ message: 'Hello from the todos/[id] route!', id: segments.id });
}