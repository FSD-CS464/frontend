"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

type Animation =
  | "neutralIdle"
  | "happyIdle"
  | "happy2Idle"
  | "sleep"
  | "sadIdle";

export default function PetWindow({
  isSleeping,
  energy,
  mood,
  onPetClick,
}: {
  isSleeping: boolean;
  energy: number;
  mood: "idle" | "sad" | "sleeping";
  onPetClick?: () => void;
}) {
  const [animation, setAnimation] = useState<Animation>("neutralIdle");
  const [isDay, setIsDay] = useState(true);

  // background switch day/night
  useEffect(() => {
    const updateTime = () => {
      const hour = new Date().getHours();
      setIsDay(hour >= 6 && hour < 18);
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  // update animation based on mood
  useEffect(() => {
    if (mood === "sleeping") setAnimation("sleep");
    else if (mood === "sad") setAnimation("sadIdle");
    else setAnimation("neutralIdle");
  }, [mood]);

  useEffect(() => {
    if (isSleeping) {
      setAnimation("sleep");
    } else if (energy < 30) {
      setAnimation("sadIdle");
    } else if (energy < 70) {
      setAnimation("neutralIdle");
    } else {
      setAnimation("happyIdle");
    }
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
      {/* Background */}
      <Image
        src={backgroundSrc}
        alt="background"
        fill
        className="object-cover pointer-events-none select-none"
        draggable={false}
      />

      {/* Pet */}
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

     {/* Click zone */}
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
        onPetClick?.(); // wake up
        setAnimation("happyIdle");
        setTimeout(resetToEnergyMood, 1000);
        } else {
        setAnimation("happy2Idle"); // pet reaction
        setTimeout(resetToEnergyMood, 1000);
        }
    }}
    />
    </div>
  );
}
