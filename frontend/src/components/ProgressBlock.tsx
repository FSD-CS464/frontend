export default function ProgressBlock() {
  return (
    <section className="card p-5">
      <div className="text-xl font-header mb-2">Daily Habits</div>
      <div className="text-sm">20% completed</div>
      <div className="mt-3 h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
        <div className="h-full w-1/5 bg-[--color-brand]"></div>
      </div>
      <a href="/habits" className="mt-12 inline-flex items-center gap-1 text-sm hover:underline font-semibold">Habits →</a>
    </section>
  );
}