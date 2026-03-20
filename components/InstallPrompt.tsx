"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
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
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto bg-[#111111] border border-[#2A2A2A] p-4 flex items-center gap-4 shadow-2xl">
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
          Add to home screen for the full experience
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleInstall}
          className="bg-[#E50914] hover:bg-[#C20812] text-white text-[9px] font-black tracking-[0.15em] uppercase px-3 py-2 transition-colors duration-200"
        >
          Install
        </button>
        <button
          onClick={() => setVisible(false)}
          className="text-[#555] hover:text-[#888] text-[9px] font-black tracking-[0.15em] uppercase px-2 py-2 transition-colors duration-200"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
