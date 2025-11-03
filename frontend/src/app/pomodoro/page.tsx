"use client";

import TopNav from "@/components/TopNav";
import MobileNav from "@/components/MobileNav";
import PomodoroTimer from "./components/PomodoroTimer";
import PetOverlay from "./components/PetOverlay";

export default function PomodoroPage() {
  return (
    <main className="pb-16 md:pb-6">
      {/* Top bar to match other pages */}
      <TopNav />

      {/* Page container */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-4xl font-header text-center">Pomodoro</h1>
        <p className="text-center text-sm text-[#6b7280] mt-2">
          Focus in 25-minute sprints. Your pet accompanies you to keep you focused. 🐾
        </p>

        {/* Content grid, same rhythm as other pages */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="md:col-span-2">
            <PomodoroTimer />
          </div>
          <div className="md:col-span-3">
            <PetOverlay />
          </div>
        </div>
      </section>

      {/* Bottom nav like other pages */}
      <MobileNav /* active prop optional; omit if your component infers */ />
      <div className="h-16 md:hidden" />
    </main>
  );
}
