import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export function ThemeToggle({ collapsed }: { collapsed: boolean }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-3 px-2 py-2 rounded transition hover:bg-[#3a31d8]/20"
    >
      {theme === "dark" ? (
        <>
          <Sun className="w-5 h-5 text-yellow-400" />
          {!collapsed && <span>Light Mode</span>}
        </>
      ) : (
        <>
          <Moon className="w-5 h-5 text-[#2f27ce]" />
          {!collapsed && <span>Dark Mode</span>}
        </>
      )}
    </button>
  );
}
