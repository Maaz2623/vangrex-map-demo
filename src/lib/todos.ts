import fs from "fs/promises";
import path from "path";

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

const filePath = path.join(process.cwd(), "src", "data", "todos.json");

export async function getTodos(): Promise<Todo[]> {
  const file = await fs.readFile(filePath, "utf-8");
  return JSON.parse(file);
}

export async function saveTodos(todos: Todo[]) {
  await fs.writeFile(filePath, JSON.stringify(todos, null, 2));
}
