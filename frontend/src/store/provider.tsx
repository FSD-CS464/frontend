'use client';

import React, { createContext, useContext, useRef } from 'react';
import { useStore as useZustandStore } from 'zustand';
import type { CounterState, CounterActions, CounterStore } from './counter';
import { createCounterStore } from './counter';

const CounterCtx = createContext<CounterStore | null>(null);

export function CounterProvider({
  children,
  initialState,
}: {
  children: React.ReactNode;
  initialState?: Partial<CounterState>;
}) {
    
  const storeRef = useRef<CounterStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = createCounterStore(initialState);
  }

  return (
    <CounterCtx.Provider value={storeRef.current}>
      {children}
    </CounterCtx.Provider>
  );
}

export function useCounter<T>(selector: (s: CounterState & CounterActions) => T): T {
  const store = useContext(CounterCtx);
  if (!store) throw new Error('CounterProvider is missing');
  return useZustandStore(store, selector);
}
