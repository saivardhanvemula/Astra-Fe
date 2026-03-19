"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface Props {
  /** Called with the raw scanned string when a QR code is decoded */
  onScan: (result: string) => void;
  /** If true the scanner is paused (e.g. after a successful scan) */
  paused?: boolean;
}

const QRCODE_REGION_ID = "astra-qr-reader";

export default function Scanner({ onScan, paused = false }: Props) {
  const html5QrRef = useRef<Html5Qrcode | null>(null);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let scanner: Html5Qrcode | null = null;

    async function startScanner() {
      try {
        scanner = new Html5Qrcode(QRCODE_REGION_ID);
        html5QrRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1,
          },
          (decodedText) => {
            if (mounted) onScan(decodedText);
          },
          // Ignore frame-level errors (no QR in frame yet) — not critical
          undefined
        );

        if (mounted) setStarted(true);
      } catch (err) {
        if (mounted) {
          const msg =
            err instanceof Error
              ? err.message
              : "Could not access camera. Please allow camera permission.";
          setError(msg);
        }
      }
    }

    startScanner();

    return () => {
      mounted = false;
      if (scanner) {
        scanner.stop().catch(() => {/* ignore stop errors on unmount */});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pause / resume when prop changes
  useEffect(() => {
    const scanner = html5QrRef.current;
    if (!scanner || !started) return;
    try {
      if (paused) scanner.pause(true);
      else scanner.resume();
    } catch {/* ignore */}
  }, [paused, started]);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Viewfinder wrapper */}
      <div className="relative bg-[#111111] border border-[#2A2A2A] overflow-hidden w-full max-w-sm">
        {/* Corner decorations */}
        <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[#E50914] z-10 pointer-events-none" />
        <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-[#E50914] z-10 pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-[#E50914] z-10 pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[#E50914] z-10 pointer-events-none" />

        {/* html5-qrcode renders its video feed into this div */}
        <div
          id={QRCODE_REGION_ID}
          className="w-full aspect-square"
          style={{ minHeight: 300 }}
        />

        {/* Scan-line animation shown while active and not paused */}
        {started && !paused && (
          <div
            className="absolute left-6 right-6 h-0.5 bg-[#E50914]/60 z-10 pointer-events-none"
            style={{
              animation: "qr-scan 2s ease-in-out infinite",
            }}
          />
        )}
      </div>

      {/* Status text */}
      {error ? (
        <p className="text-[#E50914] text-[10px] font-black tracking-[0.2em] uppercase text-center px-4">
          {error}
        </p>
      ) : !started ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-[#E50914] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#555] text-[10px] font-black tracking-[0.2em] uppercase">
            Starting camera…
          </p>
        </div>
      ) : paused ? (
        <p className="text-[#22c55e] text-[10px] font-black tracking-[0.2em] uppercase">
          Scan captured — processing…
        </p>
      ) : (
        <p className="text-[#555] text-[10px] font-black tracking-[0.2em] uppercase">
          Point camera at QR code
        </p>
      )}

      {/* Inline keyframes for scan-line */}
      <style>{`
        @keyframes qr-scan {
          0%   { top: 20%; }
          50%  { top: 75%; }
          100% { top: 20%; }
        }
      `}</style>
    </div>
  );
}
