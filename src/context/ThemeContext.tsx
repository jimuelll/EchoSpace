import { createContext, useContext, useState, useEffect } from "react";

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => Promise<void>;
  loading: boolean;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

type ThemeVariables = {
  '--bgPrimary': string;
  '--textPrimary': string;
  '--cardBackground': string;
  '--borderColor': string;
  '--mutedText': string;
  '--accent': string;
};

const themes: Record<Theme, ThemeVariables> = {
  light: {
    '--bgPrimary': '#F3F5F7',
    '--textPrimary': '#1E1E2A',
    '--cardBackground': '#FFFFFF',
    '--borderColor': '#D1D5DB',
    '--mutedText': '#6B7280',
    '--accent': '#2F27CE',
  },
  dark: {
    '--bgPrimary': '#0E0E14',
    '--textPrimary': '#EAE9FC',
    '--cardBackground': '#16161F',
    '--borderColor': '#3A31D8',
    '--mutedText': '#8C89B4',
    '--accent': '#3A31D8',
  },
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(
    (localStorage.getItem("theme") as Theme) || "light"
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const root = document.documentElement;

    // Apply theme variables to root element
    (Object.entries(themes[theme]) as [keyof ThemeVariables, string][]).forEach(
      ([key, value]) => {
        root.style.setProperty(key, value);
      }
    );

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500)); // Loader delay
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
    setLoading(false);
  };

  const contextValue = {
    theme,
    toggleTheme,
    loading,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {loading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[var(--bgPrimary)] text-[var(--textPrimary)] transition-all duration-300">
          <p className="text-lg font-semibold">Applying Theme...</p>
        </div>
      )}
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};