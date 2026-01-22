import { ThemeContext, type ThemeContextType } from "@/context/ThemeContext";
import { useContext } from "react"


export function useTheme (): ThemeContextType {
	const ctx = useContext(ThemeContext);

	if(!ctx) {
		throw new Error('ctx should be inside the theme Provider');
	}

	return ctx;
}


