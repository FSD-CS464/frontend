"use client";
import TopNav from "@/components/TopNav";
import MobileNav from "@/components/MobileNav";
import { useHabitStore } from "@/store/habits";
import { useState, useEffect } from "react";
import type { Habit } from "@/types";
import { PlusIcon, PencilIcon, TrashIcon } from "@/components/Icons";
import CreateHabitModal from "@/components/CreateHabitModal";
import EditHabitModal from "@/components/EditHabitModal";

async function getInitialHabits(): Promise<Habit[]> {
  return [
    { id: "1", title: "Go to the gym", icon: "💪", done: true, repeat: { type: "daily" } },
    { id: "2", title: "Read novel", icon: "📚", done: false, repeat: { type: "daily" } },
    { id: "3", title: "Feed cat", icon: "🐱", done: false, repeat: { type: "daily" } },
    { id: "4", title: "Default habit", icon: "💡", done: false, repeat: { type: "weekly", daysOfWeek: [1, 3, 5] } },
    { id: "5", title: "Default habit", icon: "💡", done: false, repeat: { type: "everyN", interval: 2 } },
    { id: "6", title: "Default habit", icon: "💡", done: false, repeat: { type: "everyN", interval: 2 } },
    { id: "7", title: "Default habit", icon: "💡", done: false, repeat: { type: "everyN", interval: 2 } },
    { id: "8", title: "Default habit", icon: "💡", done: false, repeat: { type: "everyN", interval: 2 } },
    { id: "9", title: "Default habit", icon: "💡", done: false, repeat: { type: "everyN", interval: 2 } },
    { id: "10", title: "Default habit", icon: "💡", done: false, repeat: { type: "everyN", interval: 2 } },
  ];
}

export default function HabitsPage() {
  const { habits, setAll, add, remove, update } = useHabitStore();
  const [deleteMode, setDeleteMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [habitToEdit, setHabitToEdit] = useState<Habit | null>(null);

  useEffect(() => {
    async function loadHabits() {
      const initialHabits = await getInitialHabits();
      setAll(initialHabits);
    }
    loadHabits();
  }, []);

  // Create
  function handleCreate(habit: Habit) {
    add(habit);
    setIsModalOpen(false);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Edit
  function handleEdit(habit: Habit) {
    setHabitToEdit(habit);
    setOpenEdit(true);
  }

  // Save edit
  function handleUpdateHabit(updatedHabit: Habit) {
    update(updatedHabit.id, updatedHabit);
    setOpenEdit(false);
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
              onClick={() => setIsModalOpen(true)}
              className="p-2 rounded-full bg-gray-100 hover:bg-[var(--color-green)] hover:text-white transform transition-transform duration-150 hover:scale-110"
            >
              <PlusIcon />
            </button>

            {/* Edit mode */}
            <button
              aria-label="Edit Habit"
              onClick={() => setEditMode(!editMode)}
              className={`p-2 rounded-full ${editMode ? 'bg-[var(--color-blue)] text-white' : 'bg-gray-100 hover:bg-[var(--color-blue)] hover:text-white'} transform transition-transform duration-150 hover:scale-110`}
            >
              <PencilIcon />
            </button>

            {/* Delete mode */}
            <button
              aria-label="Delete Habit"
              onClick={() => setDeleteMode(!deleteMode)}
              className={`p-2 rounded-full transform transition-transform duration-150 hover:scale-110 
                ${deleteMode ? "bg-[var(--color-pink)] text-white" : "bg-gray-100 hover:bg-[var(--color-pink)] hover:text-white"}`}
            >
              <TrashIcon />
            </button>
          </div>
        </div>

        {/* Habits list */}
        <div className="divide-y divide-gray-200">
          {habits.map((h) => (
            <div key={h.id} className="flex items-center justify-between p-3 gap-3 relative">
              <div className="flex items-center gap-3 flex-grow">
                {deleteMode && (
                  <button
                    className="text-gray-400 hover:text-[var(--color-pink)] transition p-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(h.id);
                    }}
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

              {/* Checkbox */}
              <div className="relative flex items-center justify-center">
                <span
                  className="absolute inset-0 bg-[#192752] rounded-full opacity-0 scale-0
                    peer-checked:opacity-20 peer-checked:scale-[2]
                    transition-all duration-300 ease-out -z-10"
                ></span>

                <input
                  type="checkbox"
                  checked={h.done}
                  onChange={() => update(h.id, { ...h, done: !h.done })}
                  className="peer size-5 rounded border-neutral-300 accent-[#192752] transition-transform duration-150 ease-in-out hover:scale-110"
                />

                {editMode && (
                  <button
                    onClick={() => handleEdit(h)}
                    className="ml-4 p-2 text-gray-400 hover:text-[var(--color-blue)] transition"
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

      {/* Modals */}
      <CreateHabitModal open={isModalOpen} onClose={handleCloseModal} onSave={handleCreate} />;

      {habitToEdit && (
        <EditHabitModal
          open={openEdit}
          habit={habitToEdit}
          onClose={() => setOpenEdit(false)} // This will close the edit modal
          onSave={handleUpdateHabit}
        />
      )}
    </main>
  );
}
