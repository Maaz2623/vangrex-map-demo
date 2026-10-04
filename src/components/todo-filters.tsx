"use client";

type Filter = "all" | "active" | "completed";

type TodoFiltersProps = {
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
};

const filters: { value: Filter; label: string }[] = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "active",
    label: "Active",
  },
  {
    value: "completed",
    label: "Completed",
  },
];

export default function TodoFilters({
  filter,
  onFilterChange,
}: TodoFiltersProps) {
  return (
    <nav aria-label="Todo filters" className="flex gap-1">
      {filters.map((item) => {
        const active = filter === item.value;

        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onFilterChange(item.value)}
            aria-pressed={active}
            className={`rounded-md px-3 py-1.5 text-sm transition ${
              active
                ? "bg-zinc-100 font-medium text-zinc-900"
                : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
