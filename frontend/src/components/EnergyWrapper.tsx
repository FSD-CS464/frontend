"use client";
import { useEffect } from "react";
import { useHabitStore } from "@/store/habits";

export default function EnergyWrapper({ children }: { children: React.ReactNode }) {
  const startEnergyLoop = useHabitStore((s) => s.startEnergyLoop);
  const stopEnergyLoop = useHabitStore((s) => s.stopEnergyLoop);

  useEffect(() => {
    startEnergyLoop();
    return () => stopEnergyLoop();
  }, [startEnergyLoop, stopEnergyLoop]);

  return <>{children}</>;
}
