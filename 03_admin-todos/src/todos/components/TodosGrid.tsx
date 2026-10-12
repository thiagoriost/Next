'use client';
import { Todo } from "@prisma/client";
import { TodoItem } from "./TodoItem";
// import * as todosApi from '@/todos/helpers/todos'
// import { useRouter } from "next/navigation";
import { toggleTodo } from "../actions/todo-actions";

/** Propiedades para mostrar y actualizar la lista de tareas. */
export interface Props {
  /** Tareas que se renderizan en la cuadrícula. */
  todos?: Todo[];
}

/**
 * Renderiza las tareas en una cuadrícula y permite cambiar su estado mediante
 * la acción de servidor correspondiente.
 *
 * @param props Propiedades de la cuadrícula.
 * @returns La cuadrícula con una tarjeta por cada tarea recibida.
 */
export const TodosGrid = ({ todos }: Props) => {
    console.log({todos})

    // const router = useRouter();

    /* const toggleTodo = async (id: string, completed: boolean) => {
        console.log("toggleTodo", { id, completed });
      try {
        
        const updatedTodo = await todosApi.updateTodo(id, completed);
        router.refresh(); // Refresh the current route to reflect the updated state
        return updatedTodo;
      } catch (error) {
        console.error('Error updating todo:', error);
        throw error;
      }
    }; */

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {todos?.map((todo) => (
        <TodoItem key={todo.id} todo={todo} toggleTodo={toggleTodo} />
      ))}
    </div>
  )
}
