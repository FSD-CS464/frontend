"use client";
import { useState, useEffect, useCallback } from "react";
import type { Habit } from "@/types";
import { XIcon } from "@/components/Icons";
import EmojiPicker from "emoji-picker-react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (habit: Habit) => void;
  habit?: Habit;
};

export default function EditHabitModal({ open, onClose, onSave, habit }: Props) {
  if (!open) return null;

  const [title, setTitle] = useState<string>("");
  const [icon, setIcon] = useState<string>("🌱");
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [repeatType, setRepeatType] = useState<"daily" | "weekly" | "everyN">("daily");
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([]);
  const [interval, setInterval] = useState<number>(2);
  const [error, setError] = useState<string>("");
  const [repeatError, setRepeatError] = useState<string>("");

  // Load habit data when modal opens or habit is updated
  useEffect(() => {
    if (habit) {
      setTitle(habit.title);
      setIcon(habit.icons);
      
      // Parse cadence to extract repeat type and values
      if (habit.cadence === "daily") {
        setRepeatType("daily");
      } else if (habit.cadence.startsWith("everyN-")) {
        setRepeatType("everyN");
        const intervalValue = parseInt(habit.cadence.split("-")[1]);
        setInterval(intervalValue || 2);
      } else if (habit.cadence.startsWith("weekly-")) {
        setRepeatType("weekly");
        const daysStr = habit.cadence.split("-")[1];
        const days = daysStr.split(",").map((d) => parseInt(d));
        setDaysOfWeek(days);
      } else {
        setRepeatType("daily");
      }
    }
  }, [habit, open]);

  const toggleDay = useCallback((day: number) => {
    setDaysOfWeek((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }, []);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (e.target.value.trim()) {
      setError("");
    }
  }, []);

  const handleSave = useCallback(() => {
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

    let cadence: Habit["cadence"];
    if (repeatType === "daily") {
      cadence = "daily";
    } else if (repeatType === "everyN") {
      cadence = `everyN-${interval}`;
    } else if (repeatType === "weekly") {
      // Format: "weekly-1,3,5" for Monday, Wednesday, Friday
      cadence = `weekly-${daysOfWeek.join(",")}`;
    } else {
      cadence = "daily";
    }

    const updatedHabit: Habit = {
      id: habit?.id || crypto.randomUUID(), // Keep existing habit ID if editing
      title,
      icons: icon,
      done: habit?.done || false,
      cadence,
    };

    onSave(updatedHabit); // Save habit when the button is clicked
    onClose(); // Close the modal after saving
  }, [title, repeatType, daysOfWeek, interval, icon, onSave, onClose, habit]);

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
          <h2 className="text-2xl font-header">Edit Habit</h2>
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
            <div className="mt-2 max-h-48 overflow-y-auto">
              <EmojiPicker
                onEmojiClick={(emoji) => {
                  setIcon(emoji.emoji); // Update icon state on emoji selection
                  setShowEmojiPicker(false); // Hide picker after selecting
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
            className={`w-full border rounded-lg px-3 py-2 focus:outline-none ${error ? "border-red-500" : "border-gray-300"}`}
            value={title}
            onChange={handleTitleChange}
            placeholder="e.g. Drink Water"
          />
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        </div>

        {/* Repeat Options */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Repeat</label>
          <select
            className={`w-full border ${repeatError ? "border-red-500" : "border-gray-300"} rounded-lg px-3 py-2 focus:outline-none`}
            value={repeatType}
            onChange={(e) => setRepeatType(e.target.value as "daily" | "weekly" | "everyN")}
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
