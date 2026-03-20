"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isIOS() {
  return (
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    // iPad on iOS 13+ reports as MacIntel with touch
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function isInStandaloneMode() {
  return (
    ("standalone" in navigator && (navigator as { standalone?: boolean }).standalone === true) ||
    window.matchMedia("(display-mode: standalone)").matches
  );
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);

  useEffect(() => {
    // Already installed — don't show anything
    if (isInStandaloneMode()) return;

    if (isIOS()) {
      setIsIOSDevice(true);
      setVisible(true);
      return;
    }

    // Chrome / Edge (Android + Desktop)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setVisible(false);
    setDeferredPrompt(null);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto bg-[#111111] border border-[#2A2A2A] p-4 shadow-2xl">
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className="w-10 h-10 bg-[#E50914] flex items-center justify-center shrink-0">
          <span className="text-white text-[10px] font-black tracking-[0.15em] uppercase">
            A
          </span>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-white text-xs font-black">Install Astra</p>
          <p className="text-[#555] text-[10px] tracking-wide">
            {isIOSDevice
              ? "Open in Safari → tap Share → Add to Home Screen"
              : "Add to home screen for the full experience"}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {!isIOSDevice && (
            <button
              onClick={handleInstall}
              className="bg-[#E50914] hover:bg-[#C20812] text-white text-[9px] font-black tracking-[0.15em] uppercase px-3 py-2 transition-colors duration-200"
            >
              Install
            </button>
          )}
          <button
            onClick={() => setVisible(false)}
            className="text-[#555] hover:text-[#888] text-[9px] font-black tracking-[0.15em] uppercase px-2 py-2 transition-colors duration-200"
          >
            ✕
          </button>
        </div>
      </div>

      {/* iOS share icon hint */}
      {isIOSDevice && (
        <div className="mt-3 flex items-center gap-2 border-t border-[#1A1A1A] pt-3">
          <svg className="w-5 h-5 text-[#555] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <p className="text-[#444] text-[9px] font-black tracking-[0.1em] uppercase">
            Tap the share icon at the bottom of Safari
          </p>
        </div>
      )}
    </div>
  );
}

