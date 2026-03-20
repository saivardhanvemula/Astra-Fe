"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { clearMembership } from "@/store/membershipSlice";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "member";
  member_id?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();

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
    setIsLoading(false);
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
    dispatch(clearMembership());
    router.push("/login");
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
