import LogoutButton from "@/components/LogoutButton";

export default function TopNav() {
  return (
    <header className="hidden md:block">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 flex items-center justify-between">
        <div className="text-[#192752] font-header text-lg tracking-tight">
          Habit Buddy
        </div>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-6 text-md">
            {[
              ["home", "/"],
              ["pet bar", "/pet-bar"],
              ["play", "/play"],
              ["habits", "/habits"],
              ["settings", "/settings"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="text-[#192752] hover:font-bold transition-all duration-200"
              >
                {label}
              </a>
            ))}
          </nav>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
