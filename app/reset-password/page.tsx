"use client";

import { useState, FormEvent, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { resetPassword } from "@/utils/api";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // If no token in URL, surface the error immediately
  const missingToken = !token;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, password);
      setDone(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Reset failed. The link may have expired."
      );
    } finally {
      setLoading(false);
    }
  }

  // Strength helper
  function getStrength(p: string): { score: number; label: string; color: string } {
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    const map = [
      { label: "Weak", color: "#E50914" },
      { label: "Fair", color: "#f59e0b" },
      { label: "Good", color: "#60a5fa" },
      { label: "Strong", color: "#22c55e" },
      { label: "Strong", color: "#22c55e" },
    ];
    return { score, ...map[score] };
  }

  const strength = getStrength(password);

  return (
    <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-10">
          <p className="text-[#E50914] text-[10px] font-black tracking-[0.35em] uppercase mb-2">
            The Real Gym
          </p>
          <h1 className="text-5xl font-black uppercase tracking-tight text-white">
            Astra
          </h1>
          <p className="text-[#555] text-sm mt-3 tracking-wide">
            Set a new password
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#111111] border border-[#2A2A2A] p-8">
          {missingToken ? (
            <div className="text-center space-y-4">
              <p className="text-[#E50914] text-[10px] font-black tracking-[0.3em] uppercase">
                Invalid or missing reset link
              </p>
              <p className="text-[#555] text-sm tracking-wide">
                Please request a new password reset link.
              </p>
              <Link
                href="/forgot-password"
                className="inline-block mt-2 bg-[#E50914] hover:bg-[#C20812] text-white text-[10px] font-black tracking-[0.2em] uppercase px-6 py-3 transition-colors duration-200"
              >
                Request Reset Link
              </Link>
            </div>
          ) : done ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-14 h-14 bg-[#0D1F12] border border-[#22c55e]/40 flex items-center justify-center">
                  <svg
                    className="w-7 h-7 text-[#22c55e]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <p className="text-[#22c55e] text-[10px] font-black tracking-[0.3em] uppercase">
                Password reset successfully
              </p>
              <p className="text-[#555] text-sm tracking-wide">
                You can now sign in with your new password.
              </p>
              <Link
                href="/login"
                className="inline-block mt-2 bg-[#E50914] hover:bg-[#C20812] text-white text-[10px] font-black tracking-[0.2em] uppercase px-6 py-3 transition-colors duration-200"
              >
                Go to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-[#E50914]/10 border border-[#E50914]/40 text-[#E50914] text-sm px-4 py-3">
                  {error}
                </div>
              )}

              {/* New password */}
              <div>
                <label className="block text-[#888] text-[10px] font-black tracking-[0.2em] uppercase mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#1A1A1A] border border-[#2A2A2A] focus:border-[#E50914] text-white placeholder-[#444] px-4 py-3 pr-10 outline-none transition-colors duration-200 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#888] transition-colors"
                    tabIndex={-1}
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
                {password.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-1 flex-1 transition-all duration-300"
                          style={{
                            background:
                              i < strength.score ? strength.color : "#1A1A1A",
                          }}
                        />
                      ))}
                    </div>
                    <p
                      className="text-[9px] font-black tracking-[0.1em] uppercase"
                      style={{ color: strength.color }}
                    >
                      {strength.label}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-[#888] text-[10px] font-black tracking-[0.2em] uppercase mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full bg-[#1A1A1A] border text-white placeholder-[#444] px-4 py-3 pr-10 outline-none transition-colors duration-200 text-sm ${
                      confirm.length > 0 && confirm !== password
                        ? "border-[#E50914]"
                        : confirm.length > 0 && confirm === password
                        ? "border-[#22c55e]"
                        : "border-[#2A2A2A] focus:border-[#E50914]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#888] transition-colors"
                    tabIndex={-1}
                  >
                    <EyeIcon open={showConfirm} />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#E50914] hover:bg-[#C20812] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black tracking-widest uppercase text-sm py-3 transition-all duration-200"
              >
                {loading ? "Resetting…" : "Reset Password"}
              </button>
            </form>
          )}
        </div>

        <p className="text-center mt-6">
          <Link
            href="/login"
            className="text-[#555] hover:text-[#888] text-[10px] font-black tracking-[0.2em] uppercase transition-colors duration-200"
          >
            ← Back to Login
          </Link>
        </p>

        <p className="text-center text-[#333] text-xs mt-4 tracking-widest uppercase">
          &copy; {new Date().getFullYear()} Astra Gym. All rights reserved.
        </p>
      </div>
    </div>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

// Wrap in Suspense because useSearchParams requires it in Next.js App Router
export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
