'use server';

import prisma from "@/lib/prisma";
import { Todo } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const sleep = async(seconds:number=0)=>{
    console.log("onSleep")
    return new Promise(resolve=>{
        setTimeout(() => {
            resolve(true);
        }, seconds*1000);
    })
}

/**
 * Actualiza el estado de finalización de una tarea y revalida la página que
 * muestra la lista.
 *
 * @param id Identificador único de la tarea.
 * @param completed Nuevo estado de finalización.
 * @returns La tarea actualizada.
 * @throws Error si no existe una tarea con el identificador indicado.
 */
export const toggleTodo = async (id: string, completed: boolean): Promise<Todo> => {

    await sleep(3);

    console.log("on toggleTodo", { id, completed });
    const todo = await prisma.todo.findFirst({ where: { id } });

    if (!todo) {
        throw new Error(`"Todo ${id} not found"`);
    }

    const updatedTodo = await prisma.todo.update({
        where: { id },
        data: { completed },
    });

    revalidatePath("/app/dashboard/server-actions-todos");
    return updatedTodo;
};

/**
 * Crea una tarea con el título y la descripción indicados y revalida la lista.
 *
 * @param description Descripción de la tarea.
 * @param title Título de la tarea.
 * @returns La tarea creada o un objeto con el mensaje y el error si falla la
 * creación.
 */
export const createTodo = async (description: string, title: string) => {
    console.log("on createTodo", { description, title });
    try {

        const todo = await prisma.todo.create({
            data: {
                description,
                title,
            },
        });

        revalidatePath("/app/dashboard/server-actions-todos");
        return todo;
    } catch (error) {
        return {
            mensaje: 'Error creando todo',
            error
        }
    }
};

/**
 * Elimina todas las tareas completadas y revalida la lista.
 *
 * Los errores se registran y no se propagan al llamador.
 *
 * @returns Una promesa que se resuelve cuando termina la operación.
 */
export const deleteCompleted = async():Promise<void> => {
    try {
        const todo = await prisma.todo.deleteMany({
            where: { completed: true },
        });

        revalidatePath("/app/dashboard/server-actions-todos");

        console.log("deleteCompleted",{todo});

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.log("deleteCompleted",{message});

    }
}