export default function StreakCard() {
  return (
    <aside className="relative w-full sm:w-80 rounded-2xl overflow-hidden bg-[var(--color-blue)] text-white p-5">
      {/* Fire image in the bottom-right corner, cropped by overflow-hidden */}
      <img
        src="/icons/fire.png"
        alt="fire"
        className="absolute bottom-0 right-0 w-28 h-28 md:w-42 md:h-42 translate-x-5 translate-y-3 md:-translate-x-1 pointer-events-none"
      />

      {/* Card content */}
      <div className="relative z-10">
        <div className="text-xl font-header -mb-2">You are on a</div>
        <div className="text-7xl font-header">4d</div>
        <div className="text-xl font-header">streak!</div>

        <div className="mt-3 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[var(--color-orange)] grid place-items-center">🔥</div>
          <span className="text-sm font-semibold">Keep it up</span>
        </div>
      </div>
    </aside>
  );
}
