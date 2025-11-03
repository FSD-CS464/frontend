"use client";
import { useState, useEffect, useMemo } from "react";

const PRESETS = [
  { label: "Pomodoro (25)", minutes: 25 },
  { label: "Short Break (5)", minutes: 5 },
  { label: "Long Break (15)", minutes: 15 },
];

export default function PomodoroTimer() {
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [round, setRound] = useState(1);

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const progress = useMemo(() => {
    const total = 25 * 60;
    return Math.min(1, Math.max(0, 1 - secondsLeft / total));
  }, [secondsLeft]);

  const setPreset = (m: number) => {
    setIsRunning(false);
    setSecondsLeft(m * 60);
  };

  const reset = () => {
    setIsRunning(false);
    setSecondsLeft(25 * 60);
    setRound((r) => r + 1);
  };

  const toggle = () => setIsRunning((r) => !r);

  return (
    <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-5 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="inline-flex items-center gap-2 text-xs font-medium text-[#374151] bg-slate-100 rounded-full px-3 py-1">
          <span className="size-2 rounded-full bg-emerald-500" />
          Round {round}
        </span>
        <div className="text-xs text-[#6b7280]">Stay consistent 💪</div>
      </div>

      <div className="flex items-center justify-center my-6">
        <div className="relative">
          <svg className="size-44 md:size-52" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" stroke="rgb(229 231 235)" strokeWidth="8" fill="none" />
            <circle
              cx="60"
              cy="60"
              r="54"
              stroke="rgb(99 102 241)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 54}`}
              strokeDashoffset={`${(1 - progress) * 2 * Math.PI * 54}`}
              transform="rotate(-90 60 60)"
            />
          </svg>

          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <div className="font-semibold text-4xl md:text-5xl text-[#111827] tabular-nums">
                {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
              </div>
              <div className="text-xs text-[#6b7280] mt-1">
                {isRunning ? "Focusing…" : "Paused"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={toggle}
          className={`px-4 py-2 rounded-xl text-white transition
            ${isRunning ? "bg-rose-500 hover:bg-rose-600" : "bg-[#28A5FF] hover:bg-[#188de0]"}`}
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#111827] transition"
        >
          Reset
        </button>
        <div className="ml-auto" />
      </div>

      <div className="grid grid-cols-3 gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => setPreset(p.minutes)}
            className="text-sm rounded-xl border border-slate-200 hover:border-[#28A5FF] hover:bg-[#28A5FF]/10 px-3 py-2 text-[#374151] transition"
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
