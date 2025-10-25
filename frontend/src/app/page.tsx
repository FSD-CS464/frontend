"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TopNav from "@/components/TopNav";
import CalendarStrip from "@/components/CalendarStrip";
import StreakCard from "@/components/StreakCard";
import HabitsList from "@/components/HabitsList";
import ProgressBlock from "@/components/ProgressBlock";
import MobileNav from "@/components/MobileNav";
import PetWindow from "@/components/PetWindow";
import type { Habit } from "@/types";
import PetEnergyBar from "@/components/PetEnergyBar";

// Simulate server data fetch
async function getInitialHabits(): Promise<Habit[]> {
  return [
    { id: "1", title: "Go to the gym", icon: "💪", done: true, repeat: { type: "daily" } },
    { id: "2", title: "Read novel", icon: "📚", done: false, repeat: { type: "daily" } },
    { id: "3", title: "Feed cat", icon: "🐱", done: false, repeat: { type: "daily" } },
    { id: "4", title: "Default habit", icon: "💡", done: false, repeat: { type: "weekly", daysOfWeek: [1, 3, 5] } },
    { id: "5", title: "Default habit", icon: "💡", done: false, repeat: { type: "everyN", interval: 2 } },
    { id: "6", title: "Default habit", icon: "💡", done: false, repeat: { type: "everyN", interval: 2 } },
    { id: "7", title: "Default habit", icon: "💡", done: false, repeat: { type: "everyN", interval: 2 } },
    { id: "8", title: "Default habit", icon: "💡", done: false, repeat: { type: "everyN", interval: 2 } },
    { id: "9", title: "Default habit", icon: "💡", done: false, repeat: { type: "everyN", interval: 2 } },
    { id: "10", title: "Default habit", icon: "💡", done: false, repeat: { type: "everyN", interval: 2 } },
  ];
}

export default function Page() {
  const router = useRouter();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // check login
    const loggedIn = localStorage.getItem("loggedIn");
    if (!loggedIn) {
      router.replace("/login");
      return;
    }

  getInitialHabits()
    .then((data) => setHabits(data))
    .finally(() => setLoading(false)); // <-- ensures loading stops
  }, [router]);

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-500">Loading habits...</p>
      </main>
    );
  }
  
  return (
    <main className="pb-16 md:pb-6">
      <TopNav />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
        {/* Greeting */}
        <h1 className="text-center font-header font-extrabold leading-tight">
          <span className="block text-4xl sm:text-4xl -mb-2">Good morning,</span>
          <span className="block text-5xl sm:text-7xl">Gregory!</span>
        </h1>

        {/* Calendar */}
        <div className="mt-10 mb-10">
          <CalendarStrip />
        </div>

        {/* MOBILE layout */}
        <div className="mt-6 grid grid-cols-2 gap-4 md:hidden">
          <StreakCard />
          <ProgressBlock />
        </div>

        <div className="mt-10 md:hidden">
          <div className="text-2xl font-header">Finished these today?</div>
          <div className="mt-3">
            <HabitsList initial={habits} />
          </div>
        </div>

        {/* DESKTOP layout */}
        <div className="mt-8 hidden md:grid md:grid-cols-[minmax(0,1fr)_320px] md:gap-6">
          {/* Left: Pet + Habits */}
          <div className="space-y-6">
            <div className="grid grid-cols-[320px_minmax(0,1fr)] gap-6">
              
            <div className="flex flex-col items-center w-[320px] gap-4">

              {/* Pet Window */}
              <div className="card flex flex-col items-center justify-center aspect-square max-h-[320px] relative w-full">
                <a
                  href="/pet-bar"
                  className="absolute top-4 right-4 text-sm font-semibold text-[#192752] z-10
                  transform transition-all duration-200 hover:scale-110 hover:underline"
                >
                  Pet Bar →
                </a>
                <PetWindow isSleeping={false} energy={80} mood="idle" />
              </div>

              {/* Pet Energy Bar */}
              <div className="w-full">
                <PetEnergyBar energy={80} />
              </div>
            </div>

              {/* Habits */}
              <div>
                <div className="text-2xl font-header">Finished these today?</div>
                <div className="mt-3">
                  <HabitsList initial={habits} />
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <StreakCard />
            <ProgressBlock />
          </div>
        </div>
      </section>

      <MobileNav active="home" />
      <div className="h-16 md:hidden" />
    </main>
  );
}

