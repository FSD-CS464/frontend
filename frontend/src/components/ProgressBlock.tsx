export default function ProgressBlock() {
  return (
    <section className="card p-5">
      <div className="font-semibold">Daily Habits</div>
      <div className="text-sm text-neutral-600 mt-1">20% completed</div>
      <div className="mt-3 h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
        <div className="h-full w-1/5 bg-[--color-brand]"></div>
      </div>
      <a href="/habits" className="mt-3 inline-flex items-center gap-1 text-sm text-neutral-700 hover:underline">Habits →</a>
    </section>
  );
}