import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server'
import * as yup from 'yup';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    console.log("get route todos[id] 33")

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

/* update a todo */
const patchSchema = yup.object({
    title: yup.string().optional(),
    description: yup.string().optional(),
    completed: yup.boolean().optional(),
});
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    console.log("PUT route todos[id] 44")

    const body = await request.json();

    try {
        const validatedBody = await patchSchema.validate(body);
        const id = (await params).id;
        const todo = await prisma.todo.update({
            where: { id },
            data: validatedBody,
        });
        return NextResponse.json({ todo });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 400 });
    }
}