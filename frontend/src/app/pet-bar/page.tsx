"use client";
import TopNav from "@/components/TopNav";
import PetWindow from "@/components/PetWindow";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import MobileNav from "@/components/MobileNav";
import PetEnergyBar from "@/components/PetEnergyBar";
import { useHabitStore } from "@/store/habits";

export default function PetBarPage() {
  const router = useRouter();

  const {
    isSleeping,
    energy,
    mood,
    setEnergy,
    toggleSleep,
    setMood,
  } = useHabitStore();

  useEffect(() => {
    let restore: NodeJS.Timeout | null = null;
    if (isSleeping) {
      restore = setInterval(() => {
        setEnergy((e) => Math.min(100, e + 2));
      }, 1000);
    }
    return () => {
      if (restore) clearInterval(restore);
    };
  }, [isSleeping, setEnergy]);

  useEffect(() => {
    let drain: NodeJS.Timeout | null = null;
    if (!isSleeping) {
      drain = setInterval(() => {
        setEnergy((e) => Math.max(0, e - 1));
      }, 2000);
    }
    return () => {
      if (drain) clearInterval(drain);
    };
  }, [isSleeping, setEnergy]);

  useEffect(() => {
    if (isSleeping) {
      setMood("sleeping");
    } else if (energy < 30) {
      setMood("sad");
    } else {
      setMood("idle");
    }
  }, [isSleeping, energy, setMood]);

  const handlePlayGames = () => router.push("/play");

  return (
    <main className="pb-16 md:pb-6">
      <TopNav />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-4xl font-header text-center">Pet Bar</h1>

        {/* pet window */}
        <div className="mt-4 flex justify-center">
          <div className="w-[400px] sm:w-[400px]">
            <PetWindow />
          </div>
        </div>

        {/* energy bar */}
        <div className="mt-6 w-full max-w-sm mx-auto">
          <PetEnergyBar />
        </div>

        {/* buttons */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={toggleSleep}
            className={`px-4 py-2 rounded-lg font-semibold transform transition-all duration-200 active:scale-95 ${
              isSleeping
                ? "bg-gray-300 hover:bg-gray-400"
                : "bg-[#28A5FF] hover:bg-[#188de0]"
            }`}
          >
            {isSleeping ? "Wake up" : "Sleep"}
          </button>

          <button
            onClick={handlePlayGames}
            className="px-4 py-2 rounded-lg bg-[var(--color-pink)] hover:bg-pink-500 font-semibold transform transition-all duration-200 active:scale-95"
          >
            Play games
          </button>
        </div>
      </section>

      <MobileNav active="pet" />
      <div className="h-16 md:hidden" />
    </main>
  );
}
