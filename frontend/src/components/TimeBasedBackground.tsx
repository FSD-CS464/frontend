"use client";
import { useEffect, useState, useMemo } from "react";

type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

function getTimeOfDay(): TimeOfDay {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
        return "morning";
    } else if (hour >= 12 && hour < 17) {
        return "afternoon";
    } else if (hour >= 17 && hour < 22) {
        return "evening";
    } else {
        return "night";
    }
}

export default function TimeBasedBackground() {
    const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(getTimeOfDay());

    useEffect(() => {
        const updateTime = () => setTimeOfDay(getTimeOfDay());
        const interval = setInterval(updateTime, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    // Generate stable star positions
    const stars = useMemo(() => {
        const baseSeed = 12345; // Fixed seed for consistent star positions
        const seededRandom = (seed: number) => {
            let s = seed;
            s = (s * 9301 + 49297) % 233280;
            return s / 233280;
        };

        return Array.from({ length: 50 }).map((_, i) => {
            const currentSeed = baseSeed + i;
            const size = seededRandom(currentSeed) * 3 + 1;
            const left = seededRandom(currentSeed + 1000) * 100;
            const top = seededRandom(currentSeed + 2000) * 80;
            const delay = i % 3;
            return { size, left, top, delay, key: i };
        });
    }, []);

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden">
            {timeOfDay === "morning" && (
                <div className="bg-animated w-full h-full" style={{
                    background: "linear-gradient(135deg, #FFE4CC 0%, #FFB380 25%, #87CEEB 50%, #FFE4CC 75%, #FFB380 100%)"
                }}>
                    {/* Morning sky with soft gradient movement */}
                </div>
            )}

            {timeOfDay === "afternoon" && (
                <div className="relative w-full h-full overflow-hidden">
                    {/* Bright blue sky */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#4A90E2] via-[#5BA3F5] to-[#87CEEB]"></div>

                    {/* Golden sun */}
                    <div className="bg-sun absolute top-1/4 right-1/4 w-32 h-32 rounded-full"
                        style={{
                            background: "radial-gradient(circle, #FFD700 0%, #FFA500 30%, rgba(255, 215, 0, 0.3) 60%, transparent 100%)",
                            boxShadow: "0 0 60px rgba(255, 215, 0, 0.6)"
                        }}>
                    </div>

                    {/* White clouds */}
                    <div className="bg-cloud absolute top-20 left-0 w-40 h-20 rounded-full opacity-80"
                        style={{
                            background: "rgba(255, 255, 255, 0.7)",
                            boxShadow: "60px 0 rgba(255, 255, 255, 0.7), 30px -20px rgba(255, 255, 255, 0.7), -20px -30px rgba(255, 255, 255, 0.7)"
                        }}>
                    </div>
                    <div className="bg-cloud-delayed absolute top-40 right-0 w-48 h-24 rounded-full opacity-70"
                        style={{
                            background: "rgba(255, 255, 255, 0.7)",
                            boxShadow: "70px 0 rgba(255, 255, 255, 0.7), 40px -25px rgba(255, 255, 255, 0.7), -25px -35px rgba(255, 255, 255, 0.7)"
                        }}>
                    </div>
                    <div className="bg-cloud absolute top-60 left-1/4 w-36 h-18 rounded-full opacity-60"
                        style={{
                            background: "rgba(255, 255, 255, 0.7)",
                            boxShadow: "50px 0 rgba(255, 255, 255, 0.7), 25px -18px rgba(255, 255, 255, 0.7), -18px -28px rgba(255, 255, 255, 0.7)"
                        }}>
                    </div>
                </div>
            )}

            {timeOfDay === "evening" && (
                <div className="bg-animated w-full h-full" style={{
                    background: "linear-gradient(135deg, #FF6B35 0%, #FF8C42 20%, #C44569 40%, #8B4789 60%, #FF6B9D 80%, #FF6B35 100%)"
                }}>
                    {/* Evening gradient with oranges, purples, and pinks */}
                </div>
            )}

            {timeOfDay === "night" && (
                <div className="relative w-full h-full overflow-hidden">
                    {/* Navy blue sky gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0A1128] via-[#1A1F3A] to-[#2A2F4A]"></div>

                    {/* Glowing moon */}
                    <div className="bg-moon absolute top-20 right-1/4 w-24 h-24 rounded-full"
                        style={{
                            background: "radial-gradient(circle, #F5F5DC 0%, #E6E6FA 40%, rgba(230, 230, 250, 0.5) 70%, transparent 100%)",
                            boxShadow: "0 0 80px rgba(245, 245, 220, 0.8), 0 0 120px rgba(245, 245, 220, 0.4)"
                        }}>
                    </div>

                    {/* Stars */}
                    {stars.map((star) => (
                        <div
                            key={star.key}
                            className={`bg-star ${star.delay === 1 ? 'bg-star-delayed' : star.delay === 2 ? 'bg-star-delayed-2' : ''} absolute rounded-full`}
                            style={{
                                width: `${star.size}px`,
                                height: `${star.size}px`,
                                left: `${star.left}%`,
                                top: `${star.top}%`,
                                background: "rgba(255, 255, 255, 0.9)",
                                boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.8)`
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

