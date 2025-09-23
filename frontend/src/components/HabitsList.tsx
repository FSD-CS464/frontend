"use client";
import { useEffect } from "react";
import { useHabitStore } from "@/store/habits";
import type { Habit } from "@/types";

export default function HabitsList({ initial }: { initial: Habit[] }) {
  const { habits, setAll, toggle } = useHabitStore();

  // Hydrate the client store exactly once with server data
  useEffect(() => {
    setAll(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="card p-4 divide-y">
      {habits.map((h) => (
        <label key={h.id} className="flex items-center justify-between py-3 gap-3">
          <div className="flex items-center gap-3">
            <span className="text-lg">{h.icon ?? "💡"}</span>
            <span>{h.title}</span>
          </div>
          <input
            aria-label={`toggle ${h.title}`}
            type="checkbox"
            checked={h.done}
            onChange={() => toggle(h.id)}
            className="size-5 rounded border-neutral-300"
          />
        </label>
      ))}
    </div>
  );
}