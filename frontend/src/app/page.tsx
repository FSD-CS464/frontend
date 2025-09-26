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
    { id: "1", title: "Go to the gym", icon: "💪", done: true, repeat: {type: "daily"} },
    { id: "2", title: "Read novel", icon: "📚", done: false, repeat: {type: "daily"} },
    { id: "3", title: "Feed cat", icon: "🐱", done: false, repeat: {type: "daily"} },
    { id: "4", title: "Default habit", icon: "💡", done: false, repeat: {type: "weekly", daysOfWeek: [1, 3, 5]} },
    { id: "5", title: "Default habit", icon: "💡", done: false, repeat: {type: "everyN", interval: 2}},
  ];
}

export default async function Page() {
  const habits = await getInitialHabits();

  return (
    <main className="pb-16 md:pb-6">
      <TopNav />

    <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
      <h1 className="text-center font-header font-extrabold leading-tight">
        {/* "Good morning" slightly smaller */}
        <span className="block text-4xl sm:text-4xl -mb-2">Good morning,</span>
        {/* "Gregory!" larger */}
        <span className="block text-5xl sm:text-7xl">Gregory!</span>
      </h1>

        {/* Calendar */}
        <div className="mt-10 mb-10">
          <CalendarStrip />
        </div>

        {/* MOBILE layout: streak + progress side by side, then habits */}
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

        {/* DESKTOP layout: original two-column with PET + right rail */}
        <div className="mt-8 hidden md:grid md:grid-cols-[minmax(0,1fr)_320px] md:gap-6">
          {/* Left: Pet + Habits */}
          <div className="space-y-6">
            <div className="grid grid-cols-[320px_minmax(0,1fr)] gap-6">
              <div className="card grid place-items-center aspect-square max-h-[320px]">
                <div className="text-neutral-500">PET</div>
              </div>

              <div>
                <div className="text-2xl font-header">Finished these today?</div>
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