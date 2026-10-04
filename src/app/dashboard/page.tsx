import { getTodos } from "@/lib/todos";
import TodoApp from "@/components/todo-app";

export default async function DashboardPage() {
  const todos = await getTodos();

  return <TodoApp initialTodos={todos} />;
}
