import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const THEME_STORAGE_KEY = "theme";
const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)";

const setDocumentTheme = (isDark: boolean) => {
  const root = document.documentElement;
  root.classList.toggle("dark", isDark);
};

const getSystemPreference = (): boolean => {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false;
  }
  return window.matchMedia(COLOR_SCHEME_QUERY).matches;
};

const getInitialTheme = (): boolean => {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "dark") return true;
    if (stored === "light") return false;
    return getSystemPreference();
  } catch {
    return getSystemPreference();
  }
};

const saveTheme = (isDark: boolean) => {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
  } catch {
    // ignore storage errors
  }
};

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    const darkMode = getInitialTheme();
    setDocumentTheme(darkMode);
    setIsDark(darkMode);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    setDocumentTheme(next);
    saveTheme(next);
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="rounded-lg border border-border bg-card p-2 text-foreground transition-colors duration-300 hover:bg-secondary"
      type="button"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
};

export default ThemeToggle;
