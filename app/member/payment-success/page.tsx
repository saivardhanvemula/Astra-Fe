"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(5);

  // Razorpay sometimes appends query params — capture them for display
  const paymentId = searchParams.get("razorpay_payment_id") ?? null;

  // Auto-redirect to dashboard after 5 s
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          router.push("/member/dashboard");
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto mb-8 w-24 h-24 rounded-full bg-[#22c55e]/10 border-2 border-[#22c55e]/30 flex items-center justify-center"
        >
          <svg
            className="w-12 h-12 text-[#22c55e]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </motion.div>

        {/* Heading */}
        <p className="text-[#22c55e] text-[10px] font-black tracking-[0.3em] uppercase mb-3">
          Payment Successful
        </p>
        <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight mb-4">
          Membership <span className="text-[#E50914]">Activated</span>
        </h1>
        <p className="text-[#555] text-sm mb-8">
          Welcome to Astra. Your membership is now active and ready to use.
        </p>

        {/* Payment ID */}
        {paymentId && (
          <div className="bg-[#111111] border border-[#2A2A2A] px-5 py-3 mb-8 inline-block">
            <p className="text-[#333] text-[8px] font-black tracking-[0.2em] uppercase mb-1">
              Payment ID
            </p>
            <p className="text-[#555] text-xs font-mono">{paymentId}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/member/dashboard"
            className="bg-[#E50914] hover:bg-[#C20812] text-white text-[10px] font-black tracking-[0.2em] uppercase px-8 py-4 transition-colors duration-200"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/member/workout"
            className="border border-[#2A2A2A] hover:border-[#E50914] text-[#555] hover:text-white text-[10px] font-black tracking-[0.2em] uppercase px-8 py-4 transition-colors duration-200"
          >
            View Workout
          </Link>
        </div>

        {/* Countdown */}
        <p className="text-[#333] text-[9px] font-black tracking-[0.15em] uppercase mt-8">
          Redirecting to dashboard in {countdown}s…
        </p>
      </motion.div>
    </div>
  );
}
