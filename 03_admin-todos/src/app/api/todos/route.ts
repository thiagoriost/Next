import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server'
import * as yup from 'yup';

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

const postSchema = yup.object({
    title: yup.string().required(),
    description: yup.string().required(),
    completed: yup.boolean().optional().default(false),
});
export async function POST(request: Request) {
    const body = await request.json();

    try {
        const validatedBody = await postSchema.validate(body);
        const todo = await prisma.todo.create({
            data: validatedBody,
        });
        return NextResponse.json({ todo }, { status: 201 });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 400 });
    }
}

