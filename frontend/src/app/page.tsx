import TopNav from "@/components/TopNav";
import CalendarStrip from "@/components/CalendarStrip";
import StreakCard from "@/components/StreakCard";
import HabitsList from "@/components/HabitsList";
import ProgressBlock from "@/components/ProgressBlock";
import MobileNav from "@/components/MobileNav";
import type { Habit } from "@/types";

// Simulate server data fetch (DB, file, or API). This runs on the server only.
async function getInitialHabits(): Promise<Habit[]> {
  return [
    { id: "1", title: "Go to the gym", icon: "💪", done: true },
    { id: "2", title: "Read novel", icon: "📚", done: false },
    { id: "3", title: "Feed cat", icon: "🐱", done: false },
    { id: "4", title: "Default habit", icon: "💡", done: false },
    { id: "5", title: "Default habit", icon: "💡", done: false },
  ];
}

export default async function Page() {
  const habits = await getInitialHabits();

  return (
    <main>
      <TopNav />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
        <h1 className="text-center text-4xl sm:text-6xl font-extrabold leading-tight">
          <span className="block text-xl">Good morning,</span>
          Gregory!
        </h1>

        {/* Calendar */}
        <div className="mt-8">
          <CalendarStrip />
        </div>

        {/* MOBILE layout: streak + progress side by side, then habits */}
        <div className="mt-6 grid grid-cols-2 gap-4 md:hidden">
          <StreakCard />
          <ProgressBlock />
        </div>

        <div className="mt-6 md:hidden">
          <div className="text-2xl font-bold">Finished these today?</div>
          <div className="mt-3">
            <HabitsList initial={habits} />
          </div>
        </div>

        {/* DESKTOP layout: original two-column with PET + right rail */}
        <div className="mt-8 hidden md:grid md:grid-cols-[minmax(0,1fr)_320px] md:gap-6">
          {/* Left: Pet + Habits */}
          <div className="space-y-6">
            <div className="grid grid-cols-[320px_minmax(0,1fr)] gap-6">
              <div className="card grid place-items-center aspect-square max-h-[320px]">
                <div className="text-neutral-500">PET</div>
              </div>

              <div>
                <div className="text-2xl font-bold">Finished these today?</div>
                <div className="mt-3">
                  <HabitsList initial={habits} />
                </div>
              </div>
            </div>

            <a href="/pet-bar"
              className="mt-auto inline-flex items-center gap-2 font-semibold">
              Pet Bar →
            </a>
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