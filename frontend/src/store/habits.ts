"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Habit } from "@/types";

type HabitState = {
  habits: Habit[];
  toggle: (id: string) => void;
  setAll: (habits: Habit[]) => void;
  add: (habit: Habit) => void;
  remove: (id: string) => void;
  update: (id: string, updates: Partial<Habit>) => void;
};

type PetMood = "idle" | "happy" | "sad" | "sleeping";

type PetState = {
  energy: number;
  moodValue: number; // Mood meter value (0-100)
  mood: PetMood; // Mood type derived from moodValue
  isSleeping: boolean;
  setEnergy: (value: number | ((prev: number) => number)) => void;
  setMoodValue: (value: number | ((prev: number) => number)) => void;
  setMood: (mood: PetMood) => void;
  toggleSleep: () => void;
  fetchEnergyAndMood: () => Promise<void>;
  syncEnergyToBackend: (energy: number) => Promise<void>;
};

export const useHabitStore = create(
  persist<HabitState & PetState>(
    (set, get) => ({
      // habit state
      habits: [],

      toggle: async (id) => {
        const state = get();
        const toggledHabit = state.habits.find((h) => h.id === id);
        if (!toggledHabit) return;
        
        const wasDone = toggledHabit.done;
        const newDoneValue = !wasDone;
        
        try {
          // Update habit in backend (which will also update energy)
          const { api } = await import("@/app/lib/api");
          const response = await api.put(`/habits/${id}`, { done: newDoneValue });
          const updatedHabit = response.data.data;
          
          // Update local state with backend response
          const updated = state.habits.map((h) =>
            h.id === id ? updatedHabit : h
          );
          
          // Fetch updated energy from backend
          await state.fetchEnergyAndMood();
          
          // Update local state
          set({ habits: updated });
        } catch (error) {
          console.error("Failed to toggle habit:", error);
          // Revert on error - don't update state
        }
      },

      setAll: (habits) => set({ habits }),

      add: (habit) =>
        set((s) => ({
          habits: [...s.habits, habit],
        })),

      remove: (id) =>
        set((s) => ({
          habits: s.habits.filter((h) => h.id !== id),
        })),

      update: (id, updates) =>
        set((s) => ({
          habits: s.habits.map((h) =>
            h.id === id ? { ...h, ...updates } : h
          ),
        })),

      // pet state
      energy: 30, // Default energy
      moodValue: 50, // Default mood value
      mood: "idle",
      isSleeping: false,

      setEnergy: (value: number | ((prev: number) => number)) =>
        set((state) => ({
          energy:
            typeof value === "function"
              ? (value as (n: number) => number)(state.energy)
              : value,
        })),

      setMoodValue: (value: number | ((prev: number) => number)) =>
        set((state) => {
          const newMoodValue =
            typeof value === "function"
              ? (value as (n: number) => number)(state.moodValue)
              : value;
          const clampedMoodValue = Math.min(100, Math.max(0, newMoodValue));
          
          // Update mood type based on mood value
          let newMood: PetMood = state.mood;
          if (state.isSleeping) {
            newMood = "sleeping";
          } else if (clampedMoodValue < 30) {
            newMood = "sad";
          } else if (clampedMoodValue <= 70) {
            newMood = "idle";
          } else {
            newMood = "happy";
          }
          
          return { moodValue: clampedMoodValue, mood: newMood };
        }),

      setMood: (mood) => set({ mood }),

      toggleSleep: () =>
        set((s) => {
          const newIsSleeping = !s.isSleeping;
          const newMood: PetMood = newIsSleeping ? "sleeping" : 
            s.moodValue < 30 ? "sad" :
            s.moodValue <= 70 ? "idle" : "happy";
          return { isSleeping: newIsSleeping, mood: newMood };
        }),

      // Fetch energy and mood from backend
      fetchEnergyAndMood: async () => {
        try {
          const { api } = await import("@/app/lib/api");
          const [energyRes, moodRes] = await Promise.all([
            api.get("/users/me/energy").catch(() => ({ data: { energy: 30 } })),
            api.get("/game/mood").catch(() => ({ data: { mood: 50 } })),
          ]);
          
          const energy = energyRes.data?.energy ?? 30;
          const rawMoodValue = moodRes.data?.mood ?? 50;
          // Ensure mood is within 0-100 range
          const moodValue = Math.min(100, Math.max(0, rawMoodValue));
          
          set((state) => {
            // Calculate mood type based on moodValue and isSleeping state
            let newMood: PetMood;
            if (state.isSleeping) {
              newMood = "sleeping";
            } else if (moodValue < 30) {
              newMood = "sad";
            } else if (moodValue <= 70) {
              newMood = "idle";
            } else {
              newMood = "happy";
            }
            return { energy, moodValue, mood: newMood };
          });
        } catch (error) {
          console.error("Failed to fetch energy and mood:", error);
        }
      },

      // Sync energy to backend
      syncEnergyToBackend: async (energy: number) => {
        try {
          const { api } = await import("@/app/lib/api");
          await api.put("/users/me/energy", { energy });
        } catch (error) {
          console.error("Failed to sync energy to backend:", error);
        }
      },
    }),
    {
      name: "habit-buddy-store",
    }
  )
);
