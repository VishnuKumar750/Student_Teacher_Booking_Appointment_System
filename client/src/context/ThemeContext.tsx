import type { Theme, ThemeContextType } from "@/Types/Theme.types";
import { createContext, useEffect, useState, ReactNode } from "react";

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
      return savedTheme;
    }
    return "system";
  });

  const [effectiveTheme, setEffectiveTheme] = useState<"light" | "dark">(
    "light",
  );

  useEffect(() => {
    // function to apply theme
    const root = window.matchMedia("(prefers-color-schema: dark)");

    const updateTheme = () => {
      const systemPrefers = root.matches;
      setEffectiveTheme(
        theme === "system" ? (systemPrefers ? "dark" : "light") : theme,
      );
    };
    updateTheme();

    root.addEventListener("change", updateTheme);

    return () => root.removeEventListener("change", updateTheme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("dark", "light");
    root.classList.add(effectiveTheme);

    if (theme === "system") {
      localStorage.removeItem("theme");
    } else {
      localStorage.setItem("theme", theme);
    }
  }, [effectiveTheme, theme]);

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, isDark: effectiveTheme === "dark" }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
