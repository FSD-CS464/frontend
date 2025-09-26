"use client";
import TopNav from "@/components/TopNav";
import MobileNav from "@/components/MobileNav";

import { useHabitStore } from "@/store/habits";
import { useState, useEffect } from "react";
import type { Habit } from "@/types";
import { PlusIcon, PencilIcon, TrashIcon } from "@/components/Icons";

// Simulate server data fetch (DB, file, or API). This runs on the server only.
async function getInitialHabits(): Promise<Habit[]> {
  return [
    { id: "1", title: "Go to the gym", icon: "💪", done: true, repeat: {type: "daily"} },
    { id: "2", title: "Read novel", icon: "📚", done: false, repeat: {type: "daily"} },
    { id: "3", title: "Feed cat", icon: "🐱", done: false, repeat: {type: "daily"} },
    { id: "4", title: "Default habit", icon: "💡", done: false, repeat: {type: "weekly", daysOfWeek: [1, 3, 5]} },
    { id: "5", title: "Default habit", icon: "💡", done: false, repeat: {type: "everyN", interval: 2}},
  ];
}

export default function HabitsPage() {
  const { habits, setAll, add, remove, update } = useHabitStore();
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("💡");
  const [deleteMode, setDeleteMode] = useState(false); // new state

  useEffect(() => {
    async function loadHabits() {
      const initialHabits = await getInitialHabits();
      setAll(initialHabits);
    }
    loadHabits();
  }, []);

  function handleCreate() {
    if (!title.trim()) return;
    const newHabit: Habit = {
      id: Date.now().toString(),
      title,
      icon,
      done: false,
      repeat: { type: "daily" },
    };
    add(newHabit);
    setTitle("");
    setIcon("💡");
  }

  return (
    <main className="pb-16 md:pb-6">
      <TopNav />

      <section className="max-w-3xl mx-auto px-4 sm:px-6 mt-16">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-header">Manage Habits</h1>

          <div className="flex gap-4">
            <button
              aria-label="Create Habit"
              className="p-2 rounded-full bg-gray-100 hover:bg-[#28A5FF] hover:text-white transform transition-transform duration-150 hover:scale-110"
            >
              <PlusIcon />
            </button>
            <button
              aria-label="Edit Habit"
              className="p-2 rounded-full bg-gray-100 hover:bg-[#50E59F] hover:text-white transform transition-transform duration-150 hover:scale-110"
            >
              <PencilIcon />
            </button>
            <button
              aria-label="Delete Habit"
              onClick={() => setDeleteMode(!deleteMode)}
              className={`p-2 rounded-full transform transition-transform duration-150 hover:scale-110 
                ${deleteMode ? "bg-[#FF4DA1] text-white" : "bg-gray-100 hover:bg-[#FF4DA1] hover:text-white"}`}
            >
              <TrashIcon />
            </button>
          </div>
        </div>

        {/* Habits list */}
        <div className="divide-y divide-gray-200">
          {habits.map((h) => (
            <label
              key={h.id}
              className="flex items-center justify-between p-3 gap-3 relative"
            >
              <div className="flex items-center gap-3">
                {deleteMode && (
                  <button
                    className="text-gray-400 hover:text-red-500 transition"
                    onClick={() => remove(h.id)}
                  >
                    🗑️
                  </button>
                )}
                <span className="text-lg">{h.icon}</span>
                <span>{h.title}</span>
                <span className="text-sm text-neutral-500">
                  {h.repeat.type === "weekly" && h.repeat.daysOfWeek
                    ? `Weekly on ${h.repeat.daysOfWeek.map((d) => ["S","M","T","W","T","F","S"][d]).join(", ")}`
                    : h.repeat.type === "everyN"
                    ? `Every ${h.repeat.interval} day(s)`
                    : "Daily"}
                </span>
              </div>
              <input
                type="checkbox"
                checked={h.done}
                onChange={() => update(h.id, { ...h, done: !h.done })}
                className="size-5 rounded border-neutral-300 accent-[#192752]"
              />
            </label>
          ))}
        </div>
      </section>

      <MobileNav active="habits" />
      <div className="h-16 md:hidden" />
    </main>
  );
}