"use client";

import { useMemo, useState } from "react";
import type { Todo } from "@/lib/todos";
import TodoForm from "./todo-form";
import TodoFilters from "./todo-filters";
import TodoItem from "./todo-item";

type Filter = "all" | "active" | "completed";

type TodoAppProps = {
  initialTodos: Todo[];
};

export default function TodoApp({ initialTodos }: TodoAppProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [filter, setFilter] = useState<Filter>("all");

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case "active":
        return todos.filter((todo) => !todo.completed);

      case "completed":
        return todos.filter((todo) => todo.completed);

      default:
        return todos;
    }
  }, [todos, filter]);

  const activeCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.filter((todo) => todo.completed).length;

  function addTodo(title: string) {
    const todo: Todo = {
      id: `todo_${Date.now()}`,
      title,
      completed: false,
    };

    setTodos((current) => [...current, todo]);
  }

  function toggleTodo(id: string) {
    setTodos((current) =>
      current.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  }

  function deleteTodo(id: string) {
    setTodos((current) => current.filter((todo) => todo.id !== id));
  }

  function clearCompleted() {
    setTodos((current) => current.filter((todo) => !todo.completed));
  }

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <header className="mb-10">
          <p className="mb-2 text-sm font-medium text-zinc-500">
            Vangrex Map Experiment
          </p>

          <h1 className="text-3xl font-semibold tracking-tight">
            Todo Dashboard
          </h1>

          <p className="mt-2 text-zinc-500">
            A basic application for experimenting with Playwright mapping.
          </p>
        </header>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <TodoForm onAdd={addTodo} />

          <div className="mt-6 flex items-center justify-between border-b border-zinc-100 pb-4">
            <TodoFilters filter={filter} onFilterChange={setFilter} />

            <div className="text-sm text-zinc-500">{activeCount} active</div>
          </div>

          <div className="mt-4">
            {filteredTodos.length === 0 ? (
              <div className="py-12 text-center text-sm text-zinc-400">
                No tasks found.
              </div>
            ) : (
              <div className="space-y-2">
                {filteredTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                  />
                ))}
              </div>
            )}
          </div>

          <footer className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-4">
            <span className="text-sm text-zinc-500">
              {completedCount} completed
            </span>

            <button
              type="button"
              onClick={clearCompleted}
              disabled={completedCount === 0}
              className="text-sm font-medium text-zinc-500 transition hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Clear completed
            </button>
          </footer>
        </section>
      </div>
    </main>
  );
}
