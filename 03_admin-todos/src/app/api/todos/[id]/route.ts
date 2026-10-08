import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const segments = await params;
    
    console.log({url: request.url})
    console.log({segments})

    /* get todo by id */
    const todo = await prisma.todo.findFirst({
        where: {
            id: segments.id,
        },
    });

    /* Agregar 404 not found */
    if (!todo) {
        return NextResponse.json({ message: 'Todo not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Hello from the todos/[id] route!', id: segments.id, todo });
}