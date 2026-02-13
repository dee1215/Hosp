import { createContext, useContext, useMemo, useState, useEffect, type ReactNode } from "react";

import type { User } from "../types";

type AuthContextValue = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

type AuthProviderProps = {
  children: ReactNode;
};

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load user from localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login: (newUser) => {
        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
      },
      logout: () => {
        setUser(null);
        localStorage.removeItem("user");
      }
    }),
    [user]
  );

  // Prevent rendering until localStorage is checked
  if (isLoading) {
    return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#f8fafc" }}>
      <p style={{ fontSize: "16px", color: "#64748b" }}>Loading...</p>
    </div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
