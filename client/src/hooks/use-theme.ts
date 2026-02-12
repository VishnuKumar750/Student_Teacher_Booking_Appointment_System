import { ThemeContext } from "@/context/theme/theme-context";
import type { ThemeContextType } from "@/Types/Theme.types";
import { useContext } from "react";

export function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext);

  if (!ctx) {
    throw new Error("ctx should be inside the theme Provider");
  }

  return ctx;
}
