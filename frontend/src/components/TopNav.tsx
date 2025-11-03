"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

export default function TopNav() {
  const pathname = usePathname();

  const nav = [
    { label: "home", href: "/" },
    { label: "pet bar", href: "/pet-bar" },
    { label: "play", href: "/play" },
    { label: "habits", href: "/habits" },
    { label: "pomodoro", href: "/pomodoro" },
    { label: "settings", href: "/settings" },
  ];

  return (
    <header className="hidden md:block">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 flex items-center justify-between">
        <div className="text-[#192752] font-header text-lg tracking-tight">
          Habit Buddy
        </div>

        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-6 text-md">
            {nav.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={`text-[#192752] transition-all duration-200 ${
                  pathname === href ? "font-bold" : "hover:font-bold"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
