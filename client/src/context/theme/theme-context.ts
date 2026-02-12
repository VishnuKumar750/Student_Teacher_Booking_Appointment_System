import type { ThemeContextType } from "@/Types/Theme.types";
import { createContext } from "react";

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);
