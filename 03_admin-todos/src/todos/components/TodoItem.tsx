import { Todo } from '@prisma/client';
import  './TodoItem.module.css';
import { IoCheckboxOutline, IoSquareOutline } from 'react-icons/io5';


interface Props {
  todo: Todo;
  toggleTodo: (id: string, completed: boolean) => Promise<Todo | void>;
}

export const TodoItem = ({ todo, toggleTodo }: Props) => {
  return (
    <div className={todo.completed ? 'todoDone' : 'todoPending'}>
      <div className="flex flex-col sm:flex-row justify-start items-center gap-4">
        <div className={`
          flex p-2 rounded-md cursor-pointer
          hover:bg-opacity-60
          ${todo.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'}
        `}
        onClick={() => toggleTodo && toggleTodo(todo.id, !todo.completed)}
        >
          {
            todo.completed
              ? <IoCheckboxOutline size={24} />
              : <IoSquareOutline size={24} />
             
          }
        </div>
        <div className="text-center sm:text-left">
          {todo.description}
        </div>
        
      </div>
    </div>
  )
}
