"use client";
import { create } from "zustand";
import type { Habit } from "@/types";

type State = {
  habits: Habit[];
  toggle: (id: string) => void;
  setAll: (habits: Habit[]) => void; // for server -> client hydration
};

export const useHabitStore = create<State>((set) => ({
  habits: [],
  toggle: (id) => set((s) => ({
    habits: s.habits.map((h) => (h.id === id ? { ...h, done: !h.done } : h)),
  })),
  setAll: (habits) => set({ habits }),
}));