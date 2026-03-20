"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { forgotPassword } from "@/utils/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

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
            Reset your password
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#111111] border border-[#2A2A2A] p-8">
          {sent ? (
            /* ── Success state ── */
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-14 h-14 bg-[#0D1F12] border border-[#22c55e]/40 flex items-center justify-center">
                  <svg
                    className="w-7 h-7 text-[#22c55e]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-[#22c55e] text-[10px] font-black tracking-[0.3em] uppercase">
                Check your email
              </p>
              <p className="text-[#555] text-sm tracking-wide">
                If an account exists for{" "}
                <span className="text-white font-black">{email}</span>, a
                password reset link has been sent.
              </p>
              <p className="text-[#444] text-xs tracking-wide pt-2">
                Didn&apos;t receive it? Check your spam folder or{" "}
                <button
                  onClick={() => {
                    setSent(false);
                    setError(null);
                  }}
                  className="text-[#E50914] hover:text-[#ff2030] font-black transition-colors"
                >
                  try again
                </button>
                .
              </p>
            </div>
          ) : (
            /* ── Form state ── */
            <form onSubmit={handleSubmit} className="space-y-5">
              <p className="text-[#555] text-[10px] font-black tracking-[0.2em] uppercase mb-1">
                Enter your registered email address and we&apos;ll send you a
                link to reset your password.
              </p>

              {error && (
                <div className="bg-[#E50914]/10 border border-[#E50914]/40 text-[#E50914] text-sm px-4 py-3">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-[#888] text-[10px] font-black tracking-[0.2em] uppercase mb-2">
                  Email Address
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

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#E50914] hover:bg-[#C20812] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black tracking-widest uppercase text-sm py-3 transition-all duration-200"
              >
                {loading ? "Sending…" : "Send Reset Link"}
              </button>
            </form>
          )}
        </div>

        {/* Back to login */}
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
