"use client";
import { useState } from "react";
import type { Habit, Repeat } from "@/types";
import { XIcon } from "@/components/Icons";
import EmojiPicker from "emoji-picker-react";

type Props = {
  open: Boolean,
  onClose: () => void;
  onSave: (habit: Habit) => void;
};

export default function CreateHabitModal({ open, onClose, onSave }: Props) {
  if (!open) return null;

  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("🌱");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [repeatType, setRepeatType] = useState<Repeat["type"]>("daily");
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([]);
  const [interval, setInterval] = useState(2);
  const [error, setError] = useState("");
  const [repeatError, setRepeatError] = useState("");

  const toggleDay = (day: number) => {
    setDaysOfWeek((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSave = () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (repeatType === "weekly" && daysOfWeek.length === 0) {
      setRepeatError("Please select at least one day of the week.");
      return;
    }

    if (repeatType === "everyN" && (!interval || interval < 1)) {
      setRepeatError("Please enter a valid interval (1 or more).");
      return;
    }

    setError("");
    setRepeatError("");

    let repeat: Repeat;
    if (repeatType === "weekly") {
      repeat = { type: "weekly", daysOfWeek };
    } else if (repeatType === "everyN") {
      repeat = { type: "everyN", interval };
    } else {
      repeat = { type: "daily" };
    }

    const newHabit: Habit = {
      id: crypto.randomUUID(),
      title,
      icon,
      done: false,
      repeat,
    };

    onSave(newHabit);
    onClose();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (e.target.value.trim()) {
      setError(""); // Remove error if title is valid
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-2xl w-96 p-6 shadow-xl relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          <XIcon />
        </button>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-header">Create New Habit</h2>
          {/* X */}
          <button
            className="p-2 text-gray-500"
            onClick={onClose}
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Icon Picker */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Icon</label>
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-3xl"
          >
            {icon}
          </button>
          {showEmojiPicker && (
            <div className="mt-2 max-h-48 overflow-y-a">
              <EmojiPicker
                onEmojiClick={(emoji) => {
                  setIcon(emoji.emoji);
                  setShowEmojiPicker(false);
                }}
                searchPlaceholder="Search emoji..."
              />
            </div>
          )}
        </div>

        {/* Title Input */}
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            className={`w-full border rounded-lg px-3 py-2 focus:outline-none ${
              error ? "border-red-500" : "border-gray-300"
            }`}
            value={title}
            onChange={handleTitleChange}
            placeholder="e.g. Drink Water"
          />
          {/* Display error for title */}
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        </div>

        {/* Repeat Options */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Repeat</label>
          <select
            className={`w-full border ${repeatError ? "border-red-500" : "border-gray-300"} rounded-lg px-3 py-2 focus:outline-none`}
            value={repeatType}
            onChange={(e) => setRepeatType(e.target.value as Repeat["type"])}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly (pick days)</option>
            <option value="everyN">Every N days</option>
          </select>

          {/* Weekly day buttons */}
          {repeatType === "weekly" && (
            <div className="flex flex-wrap gap-2 mt-3">
              {[
                { label: "S", color: "bg-[var(--color-orange)]" },
                { label: "M", color: "bg-[var(--color-lemonyellow)]" },
                { label: "T", color: "bg-[var(--color-blue)]" },
                { label: "W", color: "bg-[var(--color-green)]" },
                { label: "T", color: "bg-[var(--color-pink)]" },
                { label: "F", color: "bg-[var(--color-lemonyellow)]" },
                { label: "S", color: "bg-[var(--color-green)]" },
              ].map((day, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleDay(i)}
                  className={`w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center
                    transition-all duration-80 ease-in-out ${
                      daysOfWeek.includes(i) ? `${day.color} font-bold` : "bg-gray-100"
                    }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          )}

          {/* Every N days input */}
          {repeatType === "everyN" && (
            <div className="mt-2 flex items-center gap-2">
              <input
                type="number"
                min={1}
                value={interval}
                onChange={(e) => setInterval(Number(e.target.value))}
                className="w-20 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-0"
              />
              <span>day(s)</span>
            </div>
          )}

          {/* Display repeat error */}
          {repeatError && <p className="text-red-500 text-xs mt-2">{repeatError}</p>}
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-[var(--color-blue)] hover:bg-[#188de0] text-white font-medium py-2 rounded-lg transform transition-all duration-200 active:scale-95"
        >
          Save Habit
        </button>
      </div>
    </div>
  );
}
