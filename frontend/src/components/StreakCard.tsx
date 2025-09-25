export default function StreakCard() {
return (
    <aside className="card p-5 w-full sm:w-80">
        <div className="text-sm font-extrabold">You are on a</div>
        <div className="text-5xl font-extrabold mt-1">4d</div>
        <div className="font-extrabold">streak!</div>
        <div className="mt-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[--color-orange] grid place-items-center">🔥</div>
            <span className="text-sm font-semibold">Keep it up</span>
        </div>
    </aside>
);
}