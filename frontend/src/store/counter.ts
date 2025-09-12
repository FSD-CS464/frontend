import { createStore } from 'zustand/vanilla';

export type CounterState = { count: number };
export type CounterActions = {
  inc: () => void;
  reset: () => void;
};

export type CounterStore = ReturnType<typeof createCounterStore>;

export const createCounterStore = (preloaded?: Partial<CounterState>) =>
  createStore<CounterState & CounterActions>((set) => ({
    count: preloaded?.count ?? 0,
    inc: () => set((s) => ({ count: s.count + 1 })),
    reset: () => set({ count: 0 }),
  }));
