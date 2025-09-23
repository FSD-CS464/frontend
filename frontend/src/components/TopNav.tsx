export default function TopNav() {
  return (
    <header className="hidden md:block">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 flex items-center justify-end">
        <nav className="hidden md:flex gap-6 text-sm">
          {[
            ["home", "/"],
            ["pet bar", "/pet-bar"],
            ["play", "/play"],
            ["habits", "/habits"],
            ["settings", "/settings"],
          ].map(([label, href]) => (
            <a key={href} href={href} className="text-neutral-600 hover:text-neutral-900">
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}