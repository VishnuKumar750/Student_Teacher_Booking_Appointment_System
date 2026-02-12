import { createContext } from "react";

export type Role = "admin" | "student" | "teacher";
export type User = {
  id: string;
  email: string;
  role: Role;
  name: string;
};

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
