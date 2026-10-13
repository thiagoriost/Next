import type { Metadata } from "next";
import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { NewTodo, TodosGrid } from "@/todos";

export const metadata: Metadata = {
  title: "LTSA",
  description: "Listado de ToDos - Server Actions",
};

/**
 * Obtiene las tareas ordenadas por descripción y renderiza el formulario y la
 * cuadrícula dentro del contenido suspendible de la página.
 *
 * @returns El formulario de creación y la cuadrícula de tareas.
 */
const ServerActionsTodosContent = async () => {
  console.log("ServerActionsTodosContent Construido")
  const todos = await prisma.todo.findMany({
    orderBy: {
      description: "asc",
    },
  });

  return (
    <>
      <div className="w-full px-3 mx-5 mb-5">
        <NewTodo />
      </div>
      <TodosGrid todos={todos} />
    </>
  );
};

/**
 * Presenta la página de tareas con Server Actions y un indicador de carga
 * mientras se consultan las tareas.
 *
 * @returns El encabezado y el contenido suspendible de la página.
 */
const pageServerActionsTodos = () => (
  <>
    <span className="text-3xl font-bold text-gray-800">
      Listado de ToDos - Server Actions
    </span>
    <Suspense fallback={<div role="status">Cargando ToDos...</div>}>
      <ServerActionsTodosContent />
    </Suspense>
  </>
);

export default pageServerActionsTodos;
