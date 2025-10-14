"use client";
import { useHabitStore } from "@/store/habits";

export default function ProgressBlock() {
  const habits = useHabitStore((s) => s.habits);

  const total = habits.length;
  const completed = habits.filter((h) => h.done).length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <section className="card p-5">
      <div className="text-xl font-header mb-2">Daily Habits</div>
      <div className="text-sm">{percent}% completed</div>

      {/* Progress bar */}
      <div className="mt-3 h-3 w-full bg-neutral-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#50E59F] transition-all duration-500 ease-in-out"
          style={{ width: `${percent}%` }}
        ></div>
      </div>

      <a
        href="/habits"
        className="mt-12 inline-flex items-center gap-1 text-sm font-semibold transform transition-all duration-200 hover:scale-110 hover:underline"
      >
        Habits →
      </a>
    </section>
  );
}
