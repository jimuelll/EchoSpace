// components/ThemeToggle.tsx
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2 rounded bg-glass-light text-white dark:text-white backdrop-blur-md border border-glass-border"
    >
      {isDark ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
