"use client";
import { useEffect, useState } from "react";
import TopNav from "@/components/TopNav";
import CalendarStrip from "@/components/CalendarStrip";
import StreakCard from "@/components/StreakCard";
import HabitsList from "@/components/HabitsList";
import ProgressBlock from "@/components/ProgressBlock";
import MobileNav from "@/components/MobileNav";
import PetWindow from "@/components/PetWindow";
import PetEnergyBar from "@/components/PetEnergyBar";
import type { Habit } from "@/types";
import { useHabitStore } from "@/store/habits";
import { api } from "@/app/lib/api";

// Get greeting based on time of day
function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
        return "Good morning";
    } else if (hour >= 12 && hour < 17) {
        return "Good afternoon";
    } else if (hour >= 17 && hour < 22) {
        return "Good evening";
    } else {
        return "Good night";
    }
}

// Fetch habits from API
async function fetchHabitsFromAPI(): Promise<Habit[]> {
    try {
        const res = await api.get("/habits");
        const habits: Habit[] = res.data.data || [];
        return habits;
    } catch (error) {
        console.error("Failed to fetch habits:", error);
        return [];
    }
}

export default function Page() {
    const [loading, setLoading] = useState(true);
    const setAll = useHabitStore((s) => s.setAll);
    const [hydrated, setHydrated] = useState(false);
    const [user, setUser] = useState<{ display_name: string } | null>(null);
    const [greeting, setGreeting] = useState(getGreeting());

    useEffect(() => {
        const unsub = useHabitStore.persist.onFinishHydration(() => setHydrated(true));
        setHydrated(true);
        return unsub;
    }, []);

    // Fetch user data
    useEffect(() => {
        api
            .get("/auth/me")
            .then((res) => {
                setUser(res.data);
            })
            .catch((err) => {
                console.error("Failed to fetch user:", err);
            });
    }, []);

    // Update greeting periodically (optional - updates every minute)
    useEffect(() => {
        const updateGreeting = () => setGreeting(getGreeting());
        const interval = setInterval(updateGreeting, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (hydrated) {
            (async () => {
                try {
                    const data = await fetchHabitsFromAPI();
                    if (data.length > 0) {
                        setAll(data);
                    }
                    setLoading(false);
                } catch (error) {
                    console.error("Error loading habits:", error);
                    setLoading(false);
                }
            })();
        }
    }, [hydrated, setAll]);

    if (loading) {
        return (
            <main className="flex items-center justify-center min-h-screen">
                <p className="text-lg text-gray-500">Loading habits...</p>
            </main>
        );
    }

    return (
        <main className="pb-16 md:pb-6">
            <TopNav />

            <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
                <h1 className="text-center font-header font-extrabold leading-tight">
                    <span className="block text-4xl -mb-2">{greeting},</span>
                    <span className="block text-5xl sm:text-7xl">{user?.display_name || "Gregory"}!</span>
                </h1>

                <div className="mt-10 mb-10">
                    <CalendarStrip />
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 md:hidden">
                    <StreakCard />
                    <ProgressBlock />
                </div>

                <div className="mt-10 md:hidden">
                    <div className="text-2xl font-header">Finished these today?</div>
                    <div className="mt-3">
                        <HabitsList />
                    </div>
                </div>

                <div className="mt-8 hidden md:grid md:grid-cols-[minmax(0,1fr)_320px] md:gap-6">
                    <div className="space-y-6">
                        <div className="grid grid-cols-[320px_minmax(0,1fr)] gap-6">
                            <div className="flex flex-col items-center w-[320px] gap-4">
                                <div className="card flex flex-col items-center justify-center aspect-square max-h-[320px] relative w-full">
                                    <a
                                        href="/pet-bar"
                                        className="absolute top-4 right-4 text-sm font-semibold text-[#192752] z-10
                  transform transition-all duration-200 hover:scale-110 hover:underline"
                                    >
                                        Pet Bar →
                                    </a>
                                    {/* ⬇️ These now pull from Zustand store directly */}
                                    <PetWindow />
                                </div>
                                <div className="w-full">
                                    <PetEnergyBar />
                                </div>
                            </div>

                            <div>
                                <div className="text-2xl font-header">Finished these today?</div>
                                <div className="mt-3">
                                    <HabitsList />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <StreakCard />
                        <ProgressBlock />
                    </div>
                </div>
            </section>

            <MobileNav active="home" />
            <div className="h-16 md:hidden" />
        </main>
    );
}
