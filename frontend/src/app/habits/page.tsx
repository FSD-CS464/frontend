"use client";
import TopNav from "@/components/TopNav";
import MobileNav from "@/components/MobileNav";
import { useHabitStore } from "@/store/habits";
import { useState, useEffect } from "react";
import type { Habit } from "@/types";
import { PlusIcon, PencilIcon, TrashIcon } from "@/components/Icons";
import CreateHabitModal from "@/components/CreateHabitModal";
import EditHabitModal from "@/components/EditHabitModal";
import { api } from "@/app/lib/api";

// Fetch habits from API
async function fetchHabitsFromAPI(): Promise<Habit[]> {
    try {
        const res = await api.get("/habits");
        const habits: Habit[] = res.data.data || [];
        return habits;
    } catch (error) {
        console.error("Failed to fetch habits:", error);
        return [];
    }
}

// Create habit via API
async function createHabitAPI(habit: Omit<Habit, "id">): Promise<Habit> {
    try {
        const res = await api.post("/habits", {
            title: habit.title,
            icons: habit.icons,
            done: habit.done,
            cadence: habit.cadence,
        });
        return res.data.data;
    } catch (error) {
        console.error("Failed to create habit:", error);
        throw error;
    }
}

// Update habit via API
async function updateHabitAPI(id: string, updates: Partial<Omit<Habit, "id">>): Promise<Habit> {
    try {
        const res = await api.put(`/habits/${id}`, updates);
        return res.data.data;
    } catch (error) {
        console.error("Failed to update habit:", error);
        throw error;
    }
}

// Delete habit via API
async function deleteHabitAPI(id: string): Promise<void> {
    try {
        await api.delete(`/habits/${id}`);
    } catch (error) {
        console.error("Failed to delete habit:", error);
        throw error;
    }
}

export default function HabitsPage() {
    const { habits, setAll, add, remove, update } = useHabitStore();
    const [deleteMode, setDeleteMode] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [habitToEdit, setHabitToEdit] = useState<Habit | null>(null);
    const [loading, setLoading] = useState(true);

    // Always fetch from server on mount - don't wait for localStorage hydration
    useEffect(() => {
        (async () => {
            try {
                const data = await fetchHabitsFromAPI();
                // Clear any existing habits and set fresh data from server
                // This will automatically update localStorage via persist middleware
                setAll(data);
                setLoading(false);
            } catch (error) {
                console.error("Error loading habits:", error);
                setLoading(false);
            }
        })();
    }, [setAll]);

    // Create
    async function handleCreate(habit: Habit) {
        try {
            // Create habit in backend
            const createdHabit = await createHabitAPI({
                title: habit.title,
                icons: habit.icons,
                done: habit.done,
                cadence: habit.cadence,
            });
            // Add to store with the ID from backend
            add(createdHabit);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error creating habit:", error);
            alert("Failed to create habit. Please try again.");
        }
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
    async function handleUpdateHabit(updatedHabit: Habit) {
        try {
            // Update habit in backend - send only changed fields
            const currentHabit = habits.find((h) => h.id === updatedHabit.id);
            if (!currentHabit) {
                console.error("Habit not found in store");
                return;
            }

            // Build update object with only changed fields
            const updates: Partial<Omit<Habit, "id">> = {};
            if (currentHabit.title !== updatedHabit.title) updates.title = updatedHabit.title;
            if (currentHabit.icons !== updatedHabit.icons) updates.icons = updatedHabit.icons;
            if (currentHabit.done !== updatedHabit.done) updates.done = updatedHabit.done;
            if (currentHabit.cadence !== updatedHabit.cadence) updates.cadence = updatedHabit.cadence;

            // Only update if there are changes
            if (Object.keys(updates).length > 0) {
                const updatedHabitFromAPI = await updateHabitAPI(updatedHabit.id, updates);
                // Update store with the response from backend
                update(updatedHabitFromAPI.id, updatedHabitFromAPI);
            }
            setOpenEdit(false);
        } catch (error) {
            console.error("Error updating habit:", error);
            alert("Failed to update habit. Please try again.");
        }
    }

    if (loading) {
        return (
            <main className="flex items-center justify-center min-h-screen">
                <p className="text-lg text-gray-500">Loading habits...</p>
            </main>
        );
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
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            try {
                                                await deleteHabitAPI(h.id);
                                                remove(h.id);
                                            } catch (error) {
                                                console.error("Error deleting habit:", error);
                                                alert("Failed to delete habit. Please try again.");
                                            }
                                        }}
                                    >
                                        <TrashIcon />
                                    </button>
                                )}

                                <span className="text-lg">{h.icons}</span>
                                <span className={`${h.done ? "line-through text-gray-400" : ""}`}>
                                    {h.title}
                                </span>
                                <span className="text-sm text-neutral-500">
                                    {!h.cadence
                                        ? "No cadence set"
                                        : h.cadence === "daily"
                                            ? "Daily"
                                            : h.cadence.startsWith("everyN-")
                                                ? `Every ${h.cadence.split("-")[1]} day(s)`
                                                : h.cadence.startsWith("weekly-")
                                                    ? `Weekly on ${h.cadence
                                                        .split("-")[1]
                                                        .split(",")
                                                        .map((d) => ["S", "M", "T", "W", "T", "F", "S"][parseInt(d)])
                                                        .join(", ")}`
                                                    : h.cadence}
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
                                    onChange={async () => {
                                        const newDoneValue = !h.done;
                                        try {
                                            // Update in backend first
                                            const updatedHabit = await updateHabitAPI(h.id, { done: newDoneValue });
                                            // Then update local store
                                            update(updatedHabit.id, updatedHabit);
                                        } catch (error) {
                                            console.error("Error updating habit done status:", error);
                                            // Revert the checkbox state on error
                                            alert("Failed to update habit. Please try again.");
                                        }
                                    }}
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
