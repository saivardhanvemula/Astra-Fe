"use client";

import { useEffect, useState, useCallback } from "react";
import QRCode from "react-qr-code";
import { getCheckinQR } from "@/services/attendanceService";

const REFRESH_INTERVAL = 30; // seconds

export default function QRDisplay() {
  const [token, setToken] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQR = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const data = await getCheckinQR();
      setToken(data.token);
      setCountdown(data.expires_in ?? REFRESH_INTERVAL);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load QR code.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchQR();
  }, [fetchQR]);

  // Countdown + auto-refresh
  useEffect(() => {
    if (loading || !token) return;

    const tick = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchQR(true);
          return REFRESH_INTERVAL;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(tick);
  }, [loading, token, fetchQR]);

  // Percentage for the ring
  const pct = Math.round((countdown / REFRESH_INTERVAL) * 100);
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-8">
      {/* QR card */}
      <div className="relative bg-[#111111] border border-[#2A2A2A] p-10 flex items-center justify-center">
        {/* Refreshing overlay */}
        {refreshing && (
          <div className="absolute inset-0 bg-[#0B0B0B]/70 flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-[#E50914] border-t-transparent rounded-full animate-spin" />
              <p className="text-[#E50914] text-[10px] font-black tracking-[0.3em] uppercase">
                Refreshing…
              </p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="w-[256px] h-[256px] flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-[#E50914] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="w-[256px] h-[256px] flex flex-col items-center justify-center gap-4 text-center px-4">
            <p className="text-[#E50914] text-[10px] font-black tracking-[0.2em] uppercase">
              {error}
            </p>
            <button
              onClick={() => fetchQR()}
              className="border border-[#E50914] text-[#E50914] hover:bg-[#E50914] hover:text-white text-[10px] font-black tracking-[0.2em] uppercase px-4 py-2 transition-colors duration-200"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="bg-white p-4">
            <QRCode
              value={token ?? ""}
              size={240}
              bgColor="#ffffff"
              fgColor="#000000"
              level="H"
            />
          </div>
        )}
      </div>

      {/* Countdown ring + label */}
      {!loading && !error && (
        <div className="flex flex-col items-center gap-3">
          <div className="relative flex items-center justify-center w-20 h-20">
            <svg
              className="absolute top-0 left-0 -rotate-90"
              width="80"
              height="80"
              viewBox="0 0 80 80"
            >
              {/* Track */}
              <circle
                cx="40"
                cy="40"
                r={radius}
                fill="none"
                stroke="#1A1A1A"
                strokeWidth="4"
              />
              {/* Progress */}
              <circle
                cx="40"
                cy="40"
                r={radius}
                fill="none"
                stroke={countdown <= 10 ? "#f59e0b" : "#E50914"}
                strokeWidth="4"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                strokeLinecap="butt"
                style={{ transition: "stroke-dashoffset 0.9s linear" }}
              />
            </svg>
            <span
              className={`text-xl font-black tabular-nums ${
                countdown <= 10 ? "text-[#f59e0b]" : "text-white"
              }`}
            >
              {countdown}
            </span>
          </div>
          <p className="text-[#555] text-[10px] font-black tracking-[0.2em] uppercase">
            {refreshing ? "Refreshing…" : "Refreshes in"}
          </p>
        </div>
      )}

      {/* Instruction */}
      {!loading && !error && (
        <p className="text-[#444] text-xs tracking-wider text-center max-w-xs">
          Ask members to scan this QR code to record their gym check-in.
          Code auto-refreshes every {REFRESH_INTERVAL} seconds.
        </p>
      )}
    </div>
  );
}
