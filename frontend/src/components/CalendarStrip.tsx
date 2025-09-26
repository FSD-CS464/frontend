// Mobile: single horizontal row with scroll; Desktop: centered wrap

type DayState = "past" | "logged" | "future";

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
  { day: 9, dow: "Tue", state: "logged"},
  { day: 10, dow: "Wed", state: "logged" },
  { day: 11, dow: "Thu", state: "logged"},
  { day: 12, dow: "Fri" , state: "logged"},
  { day: 13, dow: "Sat", state: "future" },
  { day: 14, dow: "Sun", state: "future" },
];

export default function CalendarStrip() {
  // Map state → image filename
  const imageByState: Record<DayState, string> = {
    past: "Sad.png",
    logged: "Happy.png",
    future: "Neutral.png",
  };

  return (
    <div className="no-scrollbar flex gap-3 overflow-x-auto md:overflow-visible md:flex-wrap md:justify-center md:gap-4">
      {days.map((d) => {
        const stateClass = d.state === "past" ? "past" : d.state === "future" ? "future" : "";
        const base =
          d.state === "future"
            ? "bg-gray-100" // gray for future
            : !stateClass
            ? colorByDOW[d.dow]
            : "";

        return (
          <div
            key={d.day}
            className={[
              "day-pill relative shadow-none border-0 flex flex-col items-center",
              "h-[100px] md:h-[120px]",
              "px-3 md:px-2 md:py-1 mb-4 pb-6",
              "justify-start md:justify-center",
              base,
              stateClass,
            ]
              .filter(Boolean)
              .join(" ")}
            style={{ boxShadow: "none", border: "none", overflow: "visible" }} // make overflow visible
          >
          {/*day + dow*/}
          <div className="flex flex-col items-center md:-translate-y-4.5">
            <div className="text-4xl md:text-5xl font-header">{d.day}</div>
            <div className="dow text-base md:text-lg">{d.dow}</div>
          </div>

            {/* Bunny image overlay — absolutely positioned so it overlaps bottom */}
            {d.state && (
              <img
                src={`/bunnies/${imageByState[d.state]}`}
                alt={d.state}
                className="absolute -bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/3 w-9 h-10 md:w-12 md:h-14"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}