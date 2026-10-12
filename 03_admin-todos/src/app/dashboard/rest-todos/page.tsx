import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { NewTodo } from "@/todos";
import { TodosGrid } from "@/todos/components/TodosGrid";

/** Metadatos de título y descripción para la página del listado de tareas. */
export const metadata = {
 title: 'Listado de ToDos',
 description: 'Listado de ToDos',
};

/**
 * Obtiene las tareas ordenadas por descripción y presenta el formulario
 * de creación junto con la cuadrícula de tareas.
 * @returns El contenido de la página de tareas.
 */
async function RestToDosContent() {
  const todos = await prisma.todo.findMany({
    orderBy: {
      description: 'asc',
    },
  });

  return (
    <div>
      <div className="w-full px-3 mx-5 mb-5">
        <NewTodo todos={todos}/>
      </div>
      <TodosGrid todos={todos} />
    </div>
  );
}

export default function RestToDosPage() {
  return (
    <Suspense fallback={<div role="status">Cargando ToDos...</div>}>
      <RestToDosContent />
    </Suspense>
  );
}