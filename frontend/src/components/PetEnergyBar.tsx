"use client";
import React from "react";
import { useHabitStore } from "@/store/habits";

export default function PetEnergyBar() {
  const energy = useHabitStore((s) => s.energy);

  return (
    <div className="card p-4 bg-white shadow-lg rounded-lg flex flex-col justify-center items-center space-y-2">
      <div className="text-sm font-semibold text-[#192752]">Pet's Energy</div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--color-blue)] transition-all duration-500 ease-in-out"
          style={{ width: `${energy}%` }}
        ></div>
      </div>
      <div className="text-xs text-gray-500 mt-1">{energy}% Energy</div>
    </div>
  );
}
