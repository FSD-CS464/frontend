"use client";
import { useState } from "react";
import type { Habit, Repeat } from "@/types";
import { XIcon } from "@/components/Icons";
import EmojiPicker from 'emoji-picker-react';

type Props = {
  onClose: () => void;
  onSave: (habit: Habit) => void;
  open: boolean;
};

export default function CreateHabitModal({ onClose, onSave, open }: Props) {
  if (!open) return null;

  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("💡");
  const [repeatType, setRepeatType] = useState<Repeat["type"]>("daily");
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([]);
  const [interval, setInterval] = useState(2);
  const [showPicker, setShowPicker] = useState(false);


  function toggleDay(day: number) {
    setDaysOfWeek((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }

  // Handle emoji selection
  function handleEmojiClick(emojiData: any) {
    setIcon(emojiData.emoji);
    setShowPicker(false); // Hide the picker after selecting emoji
  }

  // After save
  function handleSubmit() {
    if (!title.trim()) return;

    let repeat: Repeat;
    if (repeatType === "weekly") {
      repeat = { type: "weekly", daysOfWeek };
    } else if (repeatType === "everyN") {
      repeat = { type: "everyN", interval };
    } else {
      repeat = { type: "daily" };
    }

    const newHabit: Habit = {
      id: Date.now().toString(),
      title,
      icon,
      done: false,
      repeat,
    };

    onSave(newHabit);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200"
        >
          <XIcon className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-header mb-4">Create Habit</h2>

        {/* Title */}
        <label className="block mb-3">
          <span className="block text-sm font-medium mb-1">Habit Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-0"
            placeholder="e.g. Drink water"
          />
        </label>

        {/* Icon */}
        <label className="block mb-3">
          <span className="block text-sm font-medium mb-1">Icon</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPicker((prev) => !prev)}
              className="text-2xl border border-gray-300 rounded-lg p-2 hover:bg-gray-100"
            >
              {icon}
            </button>
          </div>
          {showPicker && (
            <div className="mt-2 max-h-72 overflow-y-auto">
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                searchDisabled={false}
                searchPlaceholder="Choose icon"
                lazyLoadEmojis
                previewConfig={{ showPreview: false }}
              />
            </div>
          )}
        </label>

        {/* Repeat */}
        <label className="block mb-3">
          <span className="block text-sm font-medium mb-1">Repeats</span>
          <div className="relative">
          <select
            value={repeatType}
            onChange={(e) => setRepeatType(e.target.value as Repeat["type"])}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-2 pr-8 focus:outline-none focus:ring-0 appearance-none"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="everyN">Every N days</option>
          </select>
          
          {/* Dropdown Arrow */}
          <div className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>

        {repeatType === "weekly" && (
          <div className="flex flex-wrap gap-2 mt-2">
            {[ 
              { label: "S", color: "bg-[var(--color-orange)]" },
              { label: "M", color: "bg-[var(--color-lemonyellow)]" },
              { label: "T", color: "bg-[var(--color-blue)]" },
              { label: "W", color: "bg-[var(--color-green)]" },
              { label: "T", color: "bg-[var(--color-pink)]" },
              { label: "F", color: "bg-[var(--color-lemonyellow)]" },
              { label: "S", color: "bg-[var(--color-green)]" }
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
        </label>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-[#28A5FF] text-white hover:bg-[#188de0]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
