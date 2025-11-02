"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useHabitStore } from "@/store/habits";

type Animation =
  | "neutralIdle"
  | "happyIdle"
  | "happy2Idle"
  | "sleep"
  | "sadIdle";

export default function PetWindow() {
  const { energy, isSleeping, mood, toggleSleep } = useHabitStore();

  const [animation, setAnimation] = useState<Animation>("neutralIdle");
  const [isDay, setIsDay] = useState(true);

  // 🌞 day and night
  useEffect(() => {
    const updateTime = () => {
      const hour = new Date().getHours();
      setIsDay(hour >= 6 && hour < 18);
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isSleeping) setAnimation("sleep");
    else if (energy < 30) setAnimation("sadIdle");
    else if (energy < 70) setAnimation("neutralIdle");
    else setAnimation("happyIdle");
  }, [isSleeping, energy]);

  const backgroundSrc = isDay
    ? "/background/DAY.png"
    : "/background/NIGHT.png";

  const animations: Record<Animation, string> = {
    neutralIdle: "/petanimation/neutral_idle.gif",
    happyIdle: "/petanimation/happy_idle.gif",
    happy2Idle: "/petanimation/happy2_idle.gif",
    sleep: "/petanimation/sleep.gif",
    sadIdle: "/petanimation/sad_idle.gif",
  };

  const resetToEnergyMood = () => {
    if (energy < 30) setAnimation("sadIdle");
    else if (energy < 70) setAnimation("neutralIdle");
    else setAnimation("happyIdle");
  };

  return (
    <div
      className="relative w-full aspect-square rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100 select-none"
      onDragStart={(e) => e.preventDefault()}
    >

      <Image
        src={backgroundSrc}
        alt="background"
        fill
        className="object-cover pointer-events-none select-none"
        draggable={false}
      />

      <motion.img
        key={animation}
        src={animations[animation]}
        alt={animation}
        draggable={false}
        className="absolute w-full h-full object-contain z-20 select-none pointer-events-none"
        style={{
          transform:
            animation === "sleep"
              ? "translate(14px, 10px)"
              : "translate(14px, 30px)",
        }}
      />

      <motion.button
        className="absolute z-30 cursor-pointer"
        style={{
          top: "40%",
          left: "25%",
          width: "50%",
          height: "50%",
          background: "transparent",
        }}
        whileTap={{ scale: 0.97 }}
        onPointerDown={() => {
          if (isSleeping) {
            toggleSleep(); // wake up globally
            setAnimation("happyIdle");
            setTimeout(resetToEnergyMood, 1000);
          } else {
            setAnimation("happy2Idle"); // playful reaction
            setTimeout(resetToEnergyMood, 1000);
          }
        }}
      />
    </div>
  );
}
