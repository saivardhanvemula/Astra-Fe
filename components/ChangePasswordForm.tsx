"use client";

import { useState, FormEvent } from "react";
import { changePassword } from "@/utils/api";

interface Props {
  onSuccess?: () => void;
}

export default function ChangePasswordForm({ onSuccess }: Props) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Show/hide toggles
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (next !== confirm) {
      setError("New passwords do not match.");
      return;
    }
    if (next.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await changePassword(current, next);
      setSuccess(true);
      setCurrent("");
      setNext("");
      setConfirm("");
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change password.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="bg-[#0D1F12] border border-[#22c55e]/40 p-6 text-center">
        <svg
          className="w-8 h-8 text-[#22c55e] mx-auto mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <p className="text-[#22c55e] text-[10px] font-black tracking-[0.3em] uppercase">
          Password changed successfully
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-[#E50914]/10 border border-[#E50914]/40 text-[#E50914] text-xs px-4 py-3 tracking-wide">
          {error}
        </div>
      )}

      {/* Current password */}
      <div>
        <label className="block text-[#888] text-[10px] font-black tracking-[0.2em] uppercase mb-2">
          Current Password
        </label>
        <div className="relative">
          <input
            type={showCurrent ? "text" : "password"}
            required
            autoComplete="current-password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-[#1A1A1A] border border-[#2A2A2A] focus:border-[#E50914] text-white placeholder-[#444] px-4 py-3 pr-10 outline-none transition-colors duration-200 text-sm"
          />
          <button
            type="button"
            onClick={() => setShowCurrent((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#888] transition-colors"
            tabIndex={-1}
          >
            {showCurrent ? <EyeOff /> : <EyeOn />}
          </button>
        </div>
      </div>

      {/* New password */}
      <div>
        <label className="block text-[#888] text-[10px] font-black tracking-[0.2em] uppercase mb-2">
          New Password
        </label>
        <div className="relative">
          <input
            type={showNext ? "text" : "password"}
            required
            autoComplete="new-password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-[#1A1A1A] border border-[#2A2A2A] focus:border-[#E50914] text-white placeholder-[#444] px-4 py-3 pr-10 outline-none transition-colors duration-200 text-sm"
          />
          <button
            type="button"
            onClick={() => setShowNext((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#888] transition-colors"
            tabIndex={-1}
          >
            {showNext ? <EyeOff /> : <EyeOn />}
          </button>
        </div>
        {/* Strength bar */}
        {next.length > 0 && (
          <PasswordStrength password={next} />
        )}
      </div>

      {/* Confirm new password */}
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
              confirm.length > 0 && confirm !== next
                ? "border-[#E50914]"
                : confirm.length > 0 && confirm === next
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
            {showConfirm ? <EyeOff /> : <EyeOn />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#E50914] hover:bg-[#C20812] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black tracking-widest uppercase text-[10px] py-3 transition-all duration-200 mt-2"
      >
        {loading ? "Updating…" : "Update Password"}
      </button>
    </form>
  );
}

// ── Password strength indicator ────────────────────────────────────────────────

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

function PasswordStrength({ password }: { password: string }) {
  const { score, label, color } = getStrength(password);
  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-1 flex-1 transition-all duration-300"
            style={{ background: i < score ? color : "#1A1A1A" }}
          />
        ))}
      </div>
      <p className="text-[9px] font-black tracking-[0.1em] uppercase" style={{ color }}>
        {label}
      </p>
    </div>
  );
}

// ── Eye icons ─────────────────────────────────────────────────────────────────

function EyeOn() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function EyeOff() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );
}
