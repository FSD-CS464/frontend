"use client"
import { useState, useEffect } from "react";

// Define the types for DayState and Day
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

export default function CalendarStrip() {
  const [days, setDays] = useState<Day[]>([]);

  useEffect(() => {
    // Get current date and calculate the start of the week (Monday)
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay; // Adjust for Sunday (0) to Monday (-6)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() + diffToMonday); // Set the date to the previous Monday

    // Generate the days of the week from Monday to Sunday
    const weekDays: Day[] = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);

      // Get the day of the week and the day number
      const dayOfWeek: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun" = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i];
      const dayOfMonth = currentDate.getDate();

      // Determine the state (past, logged, future)
      let state: DayState;
      if (currentDate < today) {
        state = "past";
      } else if (currentDate.getDate() === today.getDate()) {
        state = "logged"; // Assuming logged is for today
      } else {
        state = "future";
      }

      weekDays.push({ day: dayOfMonth, dow: dayOfWeek, state });
    }

    setDays(weekDays);
  }, []); // Empty dependency array to run only on mount

  // Map state → image filename
  const imageByState: Record<DayState, string> = {
    past: "Sad.png",
    logged: "Happy.png",
    future: "Neutral.png",
  };

  return (
    <div className="no-scrollbar flex gap-3 overflow-x-auto md:overflow-visible md:flex-wrap md:justify-center md:gap-4">
      {days.map((d) => {
        const stateClass =
          d.state === "past"
            ? "past"
            : d.state === "future"
            ? "future"
            : "";
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
            {/* Day + DOW */}
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
