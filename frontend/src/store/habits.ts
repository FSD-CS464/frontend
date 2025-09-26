"use client";
import { create } from "zustand";
import type { Habit } from "@/types";

type State = {
  habits: Habit[];
  toggle: (id: string) => void;
  setAll: (habits: Habit[]) => void;
  add: (habit: Habit) => void;
  remove: (id: string) => void;
  update: (id: string, updates: Partial<Habit>) => void;
};

export const useHabitStore = create<State>((set) => ({
  habits: [],

  toggle: (id) =>
    set((s) => ({
      habits: s.habits.map((h) =>
        h.id === id ? { ...h, done: !h.done } : h
      ),
    })),

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
}));