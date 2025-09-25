export default function MobileNav({ active = "home" }: { active?: string }) {
  const items = [
    ["pet", "/pet-bar", "🐾"],
    ["play", "/play", "🎮"],
    ["home", "/", "🏠"],
    ["chat", "/habits", "💬"],
    ["settings", "/settings", "⚙️"],
  ] as const;

  return (
    <nav className="mobile-nav md:hidden">
      <ul>
        {items.map(([key, href, icon]) => (
          <li key={key}>
            <a href={href} className={"block " + (key === active ? "active" : "text-neutral-500")}>
              <div className="text-xl leading-none">{icon}</div>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}