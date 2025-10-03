"use client";
import TopNav from "@/components/TopNav";
import MobileNav from "@/components/MobileNav";
import { useHabitStore } from "@/store/habits";
import { useState, useEffect } from "react";
import type { Habit } from "@/types";
import { PlusIcon, PencilIcon, TrashIcon } from "@/components/Icons";
import CreateHabitModal from "@/components/CreateHabitModal";

// Simulate server data fetch (DB, file, or API). This runs on the server only.
async function getInitialHabits(): Promise<Habit[]> {
  return [
    { id: "1", title: "Go to the gym", icon: "💪", done: true, repeat: { type: "daily" } },
    { id: "2", title: "Read novel", icon: "📚", done: false, repeat: { type: "daily" } },
    { id: "3", title: "Feed cat", icon: "🐱", done: false, repeat: { type: "daily" } },
    { id: "4", title: "Default habit", icon: "💡", done: false, repeat: { type: "weekly", daysOfWeek: [1, 3, 5] } },
    { id: "5", title: "Default habit", icon: "💡", done: false, repeat: { type: "everyN", interval: 2 } },
  ];
}

export default function HabitsPage() {
  const { habits, setAll, add, remove, update } = useHabitStore();
  const [deleteMode, setDeleteMode] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [editMode, setEditMode] = useState(false); // Track if in edit mode

  useEffect(() => {
    async function loadHabits() {
      const initialHabits = await getInitialHabits();
      setAll(initialHabits);
    }
    loadHabits();
  }, []);

  // Handle creating a new habit
  function handleCreate(habit: Habit) {
    add(habit);
    setOpenCreate(false);
  }

  // Handle editing a habit
  function handleEdit(habit: Habit) {
    setOpenCreate(true); // Open the modal in edit mode
  }

  return (
    <main className="pb-16 md:pb-6">
      <TopNav />

      <section className="max-w-3xl mx-auto px-4 sm:px-6 mt-16">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-header">Manage Habits</h1>

          <div className="flex gap-4">
            {/* Create button */}
            <button
              aria-label="Create Habit"
              onClick={() => setOpenCreate(true)}
              className="p-2 rounded-full bg-gray-100 hover:bg-[#50E59F] hover:text-white transform transition-transform duration-150 hover:scale-110"
            >
              <PlusIcon />
            </button>

            {/* Toggle Edit Mode */}
            <button
              aria-label="Edit Habit"
              onClick={() => setEditMode(!editMode)} // Toggle edit mode
              className={`p-2 rounded-full ${editMode ? 'bg-[#28A5FF] text-white' : 'bg-gray-100 hover:bg-[#28A5FF] hover:text-white'} transform transition-transform duration-150 hover:scale-110`}
            >
              <PencilIcon />
            </button>

            {/* Delete button */}
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
          <div
            key={h.id}
            className="flex items-center justify-between p-3 gap-3 relative"
          >

          <div className="flex items-center gap-3 flex-grow">
            {/* Delete button for delete mode */}
            {deleteMode && (
              <button
                className="text-gray-400 hover:text-[#FF4DA1] transition p-2"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the click from affecting the entire row
                  remove(h.id); // Perform delete
                }}
                // Make sure hover effect is only triggered when hovering the icon
                style={{ pointerEvents: "all" }}
              >
                <TrashIcon />
              </button>
            )}

              <span className="text-lg">{h.icon}</span>
              <span>{h.title}</span>
              <span className="text-sm text-neutral-500">
                {h.repeat.type === "weekly" && h.repeat.daysOfWeek
                  ? `Weekly on ${h.repeat.daysOfWeek.map((d) => ["S", "M", "T", "W", "T", "F", "S"][d]).join(", ")}` 
                  : h.repeat.type === "everyN"
                  ? `Every ${h.repeat.interval} day(s)`
                  : "Daily"}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              {/* Checkbox for completing the habit */}
              <input
                type="checkbox"
                checked={h.done}
                onChange={() => update(h.id, { ...h, done: !h.done })}
                className="size-5 rounded border-neutral-300 accent-[#192752]"
              />

              {/* In edit mode, show pencil icon */}
              {editMode && (
                <button
                  onClick={() => handleEdit(h)} // Open the modal for editing the habit
                  className="ml-4 p-2 text-gray-400 hover:text-[#28A5FF] transition"
                >
                  <PencilIcon />
                </button>
              )}
            </div>
          </div>

          ))}
        </div>
      </section>

      <MobileNav active="habits" />
      <div className="h-16 md:hidden" />

      {/* Create/Edit Habit Modal */}
      <CreateHabitModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSave={handleCreate}
      />
    </main>
  );
}
