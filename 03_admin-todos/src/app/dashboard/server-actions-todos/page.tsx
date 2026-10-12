import type { Metadata } from "next";
import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { NewTodo, TodosGrid } from "@/todos";

export const metadata: Metadata = {
  title: "LTSA",
  description: "Listado de ToDos - Server Actions",
};

const ServerActionsTodosContent = async () => {
  const todos = await prisma.todo.findMany({
    orderBy: {
      description: "asc",
    },
  });

  return (
    <>
      <div className="w-full px-3 mx-5 mb-5">
        <NewTodo todos={todos} />
      </div>
      <TodosGrid todos={todos} />
    </>
  );
};

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
