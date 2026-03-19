"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { checkin, checkout } from "@/services/attendanceService";
import type { AttendanceSession } from "@/types";

// Scanner uses the camera API — must be client-only, no SSR
const Scanner = dynamic(() => import("@/components/Scanner"), { ssr: false });

type ScanState = "idle" | "scanning" | "processing" | "success" | "error";

function fmtTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  } catch {
    return iso;
  }
}

export default function MemberScanPage() {
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [session, setSession] = useState<AttendanceSession | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleScan = useCallback(
    async (rawToken: string) => {
      if (scanState !== "idle") return; // ignore extra frames after first scan
      setScanState("processing");
      setErrorMsg("");
      try {
        const result = await checkin(rawToken);
        setSession(result);
        setScanState("success");
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Check-in failed. Try again.";
        setErrorMsg(msg);
        setScanState("error");
      }
    },
    [scanState]
  );

  async function handleCheckout() {
    setCheckoutLoading(true);
    setErrorMsg("");
    try {
      const result = await checkout();
      setSession(result);
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Checkout failed. Please try again."
      );
    } finally {
      setCheckoutLoading(false);
    }
  }

  function reset() {
    setScanState("idle");
    setSession(null);
    setErrorMsg("");
  }

  return (
    <ProtectedRoute allowedRole="member">
      <div className="min-h-screen bg-[#0B0B0B] text-white">
        {/* Top bar */}
        <header className="border-b border-[#2A2A2A] bg-[#111111] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[#E50914] text-[10px] font-black tracking-[0.3em] uppercase">
              Astra
            </span>
            <span className="text-[#333]">/</span>
            <span className="text-[#666] text-[10px] font-black tracking-[0.2em] uppercase">
              Check-In
            </span>
          </div>
          <Link
            href="/member/dashboard"
            className="border border-[#2A2A2A] hover:border-[#E50914] text-[#888] hover:text-[#E50914] text-[10px] font-black tracking-[0.2em] uppercase px-4 py-2 transition-colors duration-200"
          >
            Dashboard
          </Link>
        </header>

        <main className="max-w-md mx-auto px-6 py-16 flex flex-col items-center">
          <p className="text-[#E50914] text-[10px] font-black tracking-[0.3em] uppercase mb-4">
            Member
          </p>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mb-2 text-center">
            Scan to Check In
          </h1>
          <p className="text-[#555] text-sm tracking-wide mb-12 text-center">
            Point your camera at the QR code displayed on the gym screen.
          </p>

          {/* ── Success state ── */}
          {scanState === "success" && session && (
            <div className="w-full flex flex-col items-center gap-6">
              {/* Success banner */}
              <div className="w-full bg-[#0D1F12] border border-[#22c55e]/40 p-6 text-center">
                <div className="flex justify-center mb-4">
                  {/* Checkmark */}
                  <svg
                    className="w-10 h-10 text-[#22c55e]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-[#22c55e] text-[10px] font-black tracking-[0.3em] uppercase mb-2">
                  Checked In
                </p>
                <p className="text-white text-2xl font-black">
                  {fmtTime(session.checkin_time)}
                </p>
              </div>

              {/* Session info */}
              <div className="w-full grid grid-cols-2 gap-3">
                <div className="bg-[#111111] border border-[#2A2A2A] p-4">
                  <p className="text-[#555] text-[9px] font-black tracking-[0.2em] uppercase mb-2">
                    Check-In
                  </p>
                  <p className="text-white font-black">
                    {fmtTime(session.checkin_time)}
                  </p>
                </div>
                <div className="bg-[#111111] border border-[#2A2A2A] p-4">
                  <p className="text-[#555] text-[9px] font-black tracking-[0.2em] uppercase mb-2">
                    Check-Out
                  </p>
                  <p className="text-white font-black">
                    {fmtTime(session.checkout_time) ?? "—"}
                  </p>
                </div>
              </div>

              {errorMsg && (
                <div className="w-full bg-[#1F0D0D] border border-[#E50914]/40 p-4 text-center">
                  <p className="text-[#E50914] text-[10px] font-black tracking-[0.2em] uppercase">
                    {errorMsg}
                  </p>
                </div>
              )}

              {/* Checkout / End Session button — shown only when no checkout yet */}
              {!session.checkout_time && (
                <button
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                  className="w-full bg-[#111111] border border-[#2A2A2A] hover:border-[#E50914] text-[#888] hover:text-[#E50914] text-[10px] font-black tracking-[0.2em] uppercase py-4 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {checkoutLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Ending Session…
                    </span>
                  ) : (
                    "End Session"
                  )}
                </button>
              )}

              {/* Scan again */}
              <button
                onClick={reset}
                className="text-[#444] hover:text-[#888] text-[10px] font-black tracking-[0.2em] uppercase transition-colors duration-200"
              >
                Scan Again
              </button>
            </div>
          )}

          {/* ── Error state ── */}
          {scanState === "error" && (
            <div className="w-full flex flex-col items-center gap-6">
              <div className="w-full bg-[#1F0D0D] border border-[#E50914]/40 p-6 text-center">
                <div className="flex justify-center mb-4">
                  <svg
                    className="w-10 h-10 text-[#E50914]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <p className="text-[#E50914] text-[10px] font-black tracking-[0.3em] uppercase mb-2">
                  Check-In Failed
                </p>
                <p className="text-[#888] text-sm mt-1">{errorMsg}</p>
              </div>
              <button
                onClick={reset}
                className="w-full bg-[#E50914] hover:bg-[#C20812] text-white text-[10px] font-black tracking-[0.2em] uppercase py-4 transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          )}

          {/* ── Scanner (idle / processing) ── */}
          {(scanState === "idle" || scanState === "processing" || scanState === "scanning") && (
            <div className="w-full">
              <Scanner
                onScan={handleScan}
                paused={scanState === "processing"}
              />
              {scanState === "processing" && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#E50914] border-t-transparent rounded-full animate-spin" />
                  <p className="text-[#E50914] text-[10px] font-black tracking-[0.2em] uppercase">
                    Processing check-in…
                  </p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
