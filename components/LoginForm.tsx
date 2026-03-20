"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { loginRequest } from "@/utils/api";

export default function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("admin@astragym.com");
  const [password, setPassword] = useState("admin@123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { token, user } = await loginRequest({ email, password });
      login(token, user);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-[#E50914]/10 border border-[#E50914]/40 text-[#E50914] text-sm px-4 py-3">
          {error}
        </div>
      )}

      <div>
        <label className="block text-[#888] text-[10px] font-black tracking-[0.2em] uppercase mb-2">
          Email
        </label>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full bg-[#1A1A1A] border border-[#2A2A2A] focus:border-[#E50914] text-white placeholder-[#444] px-4 py-3 outline-none transition-colors duration-200 text-sm"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-[#888] text-[10px] font-black tracking-[0.2em] uppercase">
            Password
          </label>
          <Link
            href="/forgot-password"
            className="text-[#555] hover:text-[#E50914] text-[10px] font-black tracking-[0.15em] uppercase transition-colors duration-200"
          >
            Forgot Password?
          </Link>
        </div>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full bg-[#1A1A1A] border border-[#2A2A2A] focus:border-[#E50914] text-white placeholder-[#444] px-4 py-3 outline-none transition-colors duration-200 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#E50914] hover:bg-[#C20812] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black tracking-widest uppercase text-sm py-3 transition-all duration-200"
      >
        {loading ? "Signing In..." : "Login"}
      </button>
    </form>
  );
}
