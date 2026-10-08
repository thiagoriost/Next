import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server'

export async function GET(request: Request) { 

    /* get take */
    const { searchParams } = new URL(request.url);
    const take = parseInt(searchParams.get('take') || '10');
    const skip = parseInt(searchParams.get('skip') || '0');
    console.log({take})
    if (isNaN(take) || take < 1) {
        return NextResponse.json({ error: 'Invalid take parameter' }, { status: 400 });
    }

    /* get all todos */
    const todos = await prisma.todo.findMany({
        take,
        skip,
    });

    return NextResponse.json({ todos });
}

/* POST */
export async function POST(request: Request) {
    const body = await request.json();

    const todo = await prisma.todo.create({
        data: body,
    });

    return NextResponse.json({body, todo}, { status: 201 });
    
}