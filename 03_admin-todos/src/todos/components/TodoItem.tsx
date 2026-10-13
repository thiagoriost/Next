'use client'
import { startTransition, useOptimistic } from 'react';
import { Todo } from '@prisma/client';
import  './TodoItem.module.css';
import { IoCheckboxOutline, IoSquareOutline } from 'react-icons/io5';


/** Propiedades necesarias para representar una tarea y cambiar su estado. */
interface Props {
  /** Tarea que se mostrará. */
  todo: Todo;
  /** Acción que actualiza el estado de finalización de la tarea. */
  toggleTodo: (id: string, completed: boolean) => Promise<Todo | void>;
}

/**
 * Muestra el título, la descripción y el indicador de estado de una tarea.
 *
 * @param props Tarea y acción para alternar su estado.
 * @returns La tarjeta visual de la tarea.
 */
export const TodoItem = ({ todo, toggleTodo }: Props) => {

  const [todoOptimistic, toggleTodoOptimistic] = useOptimistic(
    todo,
    (state, newCompleteValue: boolean)=>({...state, completed:newCompleteValue})
  )

  const onToggleTodo=async()=>{
    try {
      startTransition(()=>toggleTodoOptimistic(!todoOptimistic.completed))
      
      await toggleTodo(todoOptimistic.id, !todoOptimistic.completed)
    } catch (error) {
      console.log({error})
    }
  }

  return (
    <div className={todoOptimistic.completed ? 'todoDone' : 'todoPending'}>
      <div className="flex flex-col sm:flex-row justify-start items-center gap-4">
        <div className={`
          flex p-2 rounded-md cursor-pointer
          hover:bg-opacity-60
          ${todoOptimistic.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'}
        `}
        onClick={() => onToggleTodo()}
        >
          {
            todoOptimistic.completed
              ? <IoCheckboxOutline size={24} />
              : <IoSquareOutline size={24} />
             
          }
        </div>
        <div className="text-center sm:text-left">
          {todoOptimistic.title}
          <br />
          {todoOptimistic.description}
        </div>
        
      </div>
    </div>
  )
}
