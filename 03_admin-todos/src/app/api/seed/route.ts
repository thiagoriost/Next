// snippet rag 
import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server'

export async function GET(request: Request) {
    console.log("get route seed")
    /* delete * from todo */
    await prisma.todo.deleteMany({});

    /* const todo = await prisma.todo.create({
        data: {
            title: 'Seeded Todo',
            description: 'Todo created by the seed route',
            completed: true,
        },
    }); */

    const todo = await prisma.todo.createMany({
        data: [
            {
                title: 'Seeded Todo 1',
                description: 'First todo created by the seed route',
                completed: true,
            },
            {
                title: 'Seeded Todo 2',
                description: 'Second todo created by the seed route',
                completed: false,
            },
            {
                title: 'Seeded Todo 3',
                description: 'Third todo created by the seed route',
                completed: false,
            },
            {
                title: 'Seeded Todo 4',
                description: 'Fourth todo created by the seed route',
                completed: false,
            },
            {
                title: 'Seeded Todo 5',
                description: 'Fifth todo created by the seed route',
                completed: false,
            },
            {
                title: 'Seeded Todo 6',
                description: 'Sixth todo created by the seed route',
                completed: false,
            },
        ],
    });

    return NextResponse.json({ message: 'Hello from the seed route!', todo });
}