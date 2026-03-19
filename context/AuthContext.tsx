"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "member";
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("astra_token");
    const storedUser = localStorage.getItem("astra_user");
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("astra_token");
        localStorage.removeItem("astra_user");
      }
    }
  }, []);

  function login(token: string, user: AuthUser) {
    localStorage.setItem("astra_token", token);
    localStorage.setItem("astra_user", JSON.stringify(user));
    setToken(token);
    setUser(user);
    router.push(user.role === "admin" ? "/admin/dashboard" : "/member/dashboard");
  }

  function logout() {
    localStorage.removeItem("astra_token");
    localStorage.removeItem("astra_user");
    setToken(null);
    setUser(null);
    router.push("/login");
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
