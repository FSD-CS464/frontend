"use client";
import { useEffect } from "react";
import { useHabitStore } from "@/store/habits";
import type { Habit } from "@/types";

export default function HabitsList({ initial }: { initial: Habit[] }) {
  const { habits, setAll, toggle } = useHabitStore();

  useEffect(() => {
    setAll(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="card p-4 divide-y divide-gray-200 max-h-[372px] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-transparent"
    >
      {habits.map((h) => (
        <label
          key={h.id}
          className="flex items-center justify-between py-3 gap-3 transition-colors hover:bg-gray-50 rounded-lg px-2"
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">{h.icon ?? "💡"}</span>
            <span className={`${h.done ? "line-through text-gray-400" : ""}`}>
              {h.title}
            </span>
          </div>

          {/* Checkbox */}
          <div className="relative flex items-center justify-center">
            {/* Pulse effect */}
            <span
              className="absolute inset-0 bg-[#192752] rounded-full opacity-0 scale-0
              peer-checked:opacity-20 peer-checked:scale-[2]
              transition-all duration-300 ease-out -z-10"
            ></span>

            <input
              aria-label={`toggle ${h.title}`}
              type="checkbox"
              checked={h.done}
              onChange={() => toggle(h.id)}
              className="peer size-5 rounded border-neutral-300 accent-[#192752] transition-transform duration-150 ease-in-out hover:scale-110"
            />
          </div>
        </label>
      ))}
    </div>
  );
}
