// Mobile: single horizontal row with scroll; Desktop: centered wrap

type DayState = "past" | "today" | "future";

type Day = {
  day: number;
  dow: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
  state?: DayState;
};

// Map DOW → color based on your style guide mock
const colorByDOW: Record<Day["dow"], string> = {
  Mon: "bg-[var(--color-orange)]",
  Tue: "bg-[var(--color-lemonyellow)]",
  Wed: "bg-[var(--color-blue)]",
  Thu: "bg-[var(--color-green)]",
  Fri: "bg-[var(--color-pink)]",
  Sat: "bg-[var(--color-lemonyellow)]",
  Sun: "bg-[var(--color-green)]",
};

// Static sample sequence matching the screenshot
const days: Day[] = [
  { day: 8, dow: "Mon", state: "past" },
  { day: 9, dow: "Tue" },
  { day: 10, dow: "Wed", state: "today" },
  { day: 11, dow: "Thu" },
  { day: 12, dow: "Fri" },
  { day: 13, dow: "Sat", state: "future" },
  { day: 14, dow: "Sun", state: "future" },
];

export default function CalendarStrip() {
  return (
    <div className="no-scrollbar flex gap-3 overflow-x-auto md:overflow-visible md:flex-wrap md:justify-center md:gap-4">
      {days.map((d) => {
        const stateClass = d.state === "past" ? "past" : d.state === "future" ? "future" : "";

        const base = !stateClass ? colorByDOW[d.dow] : "";

        return (
          <div key={d.day} className={["day-pill", base, stateClass].filter(Boolean).join(" ")}> 
            <div className="text-3xl">{d.day}</div>
            <div className="dow">{d.dow}</div>
            <div className="mt-2">🐰</div>
          </div>
        );
      })}
    </div>
  );
}