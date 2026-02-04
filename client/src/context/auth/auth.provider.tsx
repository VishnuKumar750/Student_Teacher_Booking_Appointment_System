import { useState, useEffect, useMemo, type ReactNode } from "react";
import api from "@/axios/axios-api";
import { AuthContext, type User } from "./auth.context";

const USER_KEY = "auth_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  // 1️⃣ Instant restore from localStorage
  const [user, setUser] = useState<User | null>(() => {
    try {
      const cached = localStorage.getItem(USER_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(true);
  const hasSessionCookie = document.cookie.includes("token"); // example

  // 2️⃣ Validate session with backend cookie
  useEffect(() => {
    const validateSession = async () => {
      try {
        if (user || !hasSessionCookie) return;

        const { data } = await api.get("/auth/me", {
          withCredentials: true,
        });
        setUser(data.user);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      } catch {
        setUser(null);
        localStorage.removeItem(USER_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    validateSession();
  }, [hasSessionCookie, user]);

  useEffect(() => {
    if (!document.cookie.includes("token")) {
      setIsLoading(false);
      return;
    }
  }, []);

  // login from signin form
  const login = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
  };

  // logout
  const logout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
    } finally {
      setUser(null);
      localStorage.removeItem(USER_KEY);
    }
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
