"use client";

import React from "react";
import { IoTrashOutline } from "react-icons/io5";
import { createTodo, deleteCompleted } from "../actions/todo-actions";


/* import * as todosApi from "@/todos/helpers/todos";
import { useRouter } from "next/navigation"; */


/**
 * Formulario para crear tareas y eliminar las que ya están completadas.
 *
 * @returns Los campos de título y descripción, y los botones de acción.
 */
export const NewTodo = () => {
  const [description, setDescription] = React.useState("");
  const [title, setTitle] = React.useState("");
  // const router = useRouter();
  

  /**
   * Evita el envío nativo, valida que ambos campos tengan contenido y solicita
   * la creación de una tarea antes de limpiar el formulario.
   *
   * @param e Evento de envío del formulario.
   * @returns Una promesa que se resuelve después de procesar el envío.
   */
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ description, title });
    if (description.trim().length === 0 || title.trim().length === 0) {
      console.log("Description or title is empty");
      return;
    }
    /* logica para crear el todo */
    try {
      /* const crearTodo = await todosApi.createTodo(description, title);
      router.refresh(); // Refresh the current route to reflect the updated state
      */
     const todo = createTodo(description, title)
     console.log({ todo });
      setDescription("");
      setTitle("");
    } catch (error) {
      console.error("Error creating todo:", error);
      throw error;
    }
  };

  /* async function deleteCompleted(): Promise<void> {
    todosApi.deleteCompletedTodos()
        .then(() => router.refresh())
        .catch(error => {
          console.error(`Error deleting todo with id:`, error);
        });
        
  } */

  return (
    <form className="flex w-full" onSubmit={onSubmit}>
        <div className="flex flex-col items-center w-full">
            <input
                type="text"
                className="w-6/12 -ml-10 pl-3 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-sky-500 transition-all"
                placeholder="Título"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <input
                type="text"
                className="w-6/12 -ml-10 pl-3 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-sky-500 transition-all"
                placeholder="¿Qué necesita ser hecho?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
        </div>

        {
            description.length > 0 && title.length > 0 && (
                <button
                    type="submit"
                    className="flex items-center justify-center rounded ml-2 bg-sky-500 p-2 text-white hover:bg-sky-700 transition-all"
                >
                    Crear
                </button>
            )   
        }

      <span className="flex flex-1"></span>

      <button
        onClick={ () => deleteCompleted() }
        type="button"
        className="flex items-center justify-center rounded ml-2 bg-red-400 p-2 text-white hover:bg-red-700 transition-all"
      >
        <IoTrashOutline />
        Delete
      </button>
    </form>
  );
};
