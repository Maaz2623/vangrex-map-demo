"use client";

import type { Todo } from "@/lib/todos";

type TodoItemProps = {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-transparent px-3 py-3 transition hover:border-zinc-200 hover:bg-zinc-50">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-label={`Complete ${todo.title}`}
        className="h-4 w-4"
      />

      <span
        className={`min-w-0 flex-1 text-sm ${
          todo.completed ? "text-zinc-400 line-through" : "text-zinc-800"
        }`}
      >
        {todo.title}
      </span>

      <button
        type="button"
        onClick={() => onDelete(todo.id)}
        aria-label={`Delete ${todo.title}`}
        className="text-sm text-zinc-400 transition hover:text-red-600"
      >
        Delete
      </button>
    </div>
  );
}
