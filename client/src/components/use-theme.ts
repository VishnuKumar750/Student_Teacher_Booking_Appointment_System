import { useContext } from "react";

export function useTheme() {
  const ctx = useContext(ThemeContext);

  if (!ctx) {
    throw new Error("useTheem must be used within ThemeProvider");
  }

  return ctx;
}
