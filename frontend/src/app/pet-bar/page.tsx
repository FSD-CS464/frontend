"use client";

import TopNav from "@/components/TopNav";
import PetWindow from "@/components/PetWindow";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MobileNav from "@/components/MobileNav";
import PetEnergyBar from "@/components/PetEnergyBar";

export default function PetBarPage() {
  const [isSleeping, setIsSleeping] = useState(false);
  const [energy, setEnergy] = useState(80);
  const router = useRouter();

  // Restore energy while sleeping
  useEffect(() => {
    let restore: NodeJS.Timeout | null = null;
    if (isSleeping) {
      restore = setInterval(() => {
        setEnergy((e) => {
          if (e >= 100) {
            clearInterval(restore!);
            return 100;
          }
          return e + 2;
        });
      }, 1000);
    }
    return () => {
      if (restore) clearInterval(restore);
    };
  }, [isSleeping]);

  // Passive energy drain
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
  }, [isSleeping]);

  const handleSleep = () => setIsSleeping((prev) => !prev);
  const handlePlayGames = () => router.push("/play");

  // Wake by clicking pet
  const handlePetClick = () => setIsSleeping(false);

  const mood =
    isSleeping ? "sleeping" : energy < 30 ? "sad" : "idle";

  return (
    <main className="pb-16 md:pb-6">
      <TopNav />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-4xl font-header text-center">Pet Bar</h1>

        <div className="mt-4 flex justify-center">
          <div className="w-[400px] sm:w-[400px]">
            <PetWindow
              isSleeping={isSleeping}
              energy={energy}
              mood={mood}
              onPetClick={handlePetClick}
            />
          </div>
        </div>

        
        {/* Pet energy bar */}
        <div className="mt-6 w-full max-w-sm mx-auto">
          <PetEnergyBar energy={energy} />
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={handleSleep}
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
            className="px-4 py-2 rounded-lg bg-[#FF4DA1] hover:bg-pink-500 font-semibold transform transition-all duration-200 active:scale-95"
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
