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
  mood: PetMood;
  isSleeping: boolean;
  energyInterval: NodeJS.Timeout | null;
  setEnergy: (value: number | ((prev: number) => number)) => void;
  setMood: (mood: PetMood) => void;
  toggleSleep: () => void;
  startEnergyLoop: () => void;
  stopEnergyLoop: () => void;
};

export const useHabitStore = create(
  persist<HabitState & PetState>(
    (set, get) => ({
      // habit state
      habits: [],

      toggle: (id) =>
        set((s) => {
          const updated = s.habits.map((h) =>
            h.id === id ? { ...h, done: !h.done } : h
          );

          const toggledHabit = s.habits.find((h) => h.id === id);
          const wasDone = toggledHabit?.done ?? false;
          const energyChange = wasDone ? -5 : +5; // lose energy if undone, gain if done

          const newEnergy = Math.min(100, Math.max(0, s.energy + energyChange));
          const newMood = wasDone ? "sad" : "happy";

          return { habits: updated, energy: newEnergy, mood: newMood };
        }),

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
      energy: 80,
      mood: "idle",
      isSleeping: false,
      energyInterval: null,

      setEnergy: (value: number | ((prev: number) => number)) =>
        set((state) => ({
          energy:
            typeof value === "function"
              ? (value as (n: number) => number)(state.energy)
              : value,
        })),

      setMood: (mood) => set({ mood }),

      toggleSleep: () =>
        set((s) => ({
          isSleeping: !s.isSleeping,
          mood: s.isSleeping ? "idle" : "sleeping",
        })),

      // energy bar
      startEnergyLoop: () => {
        const current = get();
        if (current.energyInterval) return;

        const interval = setInterval(() => {
          set((s) => {
            const delta = s.isSleeping ? +2 : -1;
            const newEnergy = Math.min(100, Math.max(0, s.energy + delta));

            let newMood: PetMood = s.mood;
            if (s.isSleeping) newMood = "sleeping";
            else if (newEnergy < 30) newMood = "sad";
            else newMood = "idle";

            return { energy: newEnergy, mood: newMood };
          });
        }, 2000);

        set({ energyInterval: interval });
      },

      stopEnergyLoop: () => {
        const interval = get().energyInterval;
        if (interval) clearInterval(interval);
        set({ energyInterval: null });
      },
    }),
    {
      name: "habit-buddy-store",
    }
  )
);
