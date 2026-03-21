"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ProtectedRoute from "@/components/ProtectedRoute";
import { apiClient } from "@/services/apiClient";
import { createOrder, verifyPayment, loadRazorpayScript } from "@/services/paymentService";
import { getStoredUser } from "@/utils/auth";
import type { Plan } from "@/types";

interface ApiPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
}

const POPULAR = "Quarterly";

export default function MemberPlansPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = useCallback((msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  useEffect(() => {
    apiClient
      .get<{ success: boolean; count: number; data: ApiPlan[] }>("/api/plans")
      .then((res) => {
        setPlans(
          res.data.data.map((p) => ({ ...p, popular: p.name === POPULAR }))
        );
      })
      .catch(() => setFetchError(true))
      .finally(() => setLoading(false));
  }, []);

  async function handleBuy(planId: string) {
    setProcessingId(planId);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        showToast("Failed to load payment gateway. Check your connection.", "error");
        return;
      }

      const orderData = await createOrder(planId);
      const user = getStoredUser();

      const rzp = new window.Razorpay({
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency ?? "INR",
        order_id: orderData.order_id,
        name: "Astra – The Real Gym",
        description: plans.find((p) => p.id === planId)?.name ?? "Membership",
        image: "/icon-192.png",
        prefill: {
          name: user?.name ?? "",
          email: user?.email ?? "",
        },
        theme: { color: "#E50914" },
        handler: async function (response) {
          try {
            await verifyPayment(response);
            router.push(
              `/member/payment-success?razorpay_payment_id=${encodeURIComponent(response.razorpay_payment_id)}`
            );
          } catch {
            showToast("Payment verification failed. Contact support.", "error");
          }
        },
        modal: {
          ondismiss: () => {
            showToast("Payment cancelled.", "error");
            setProcessingId(null);
          },
        },
      });

      rzp.open();
    } catch {
      showToast("Could not initiate payment. Please try again.", "error");
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <ProtectedRoute allowedRole="member">
      <div className="min-h-screen bg-[#0B0B0B] text-white">
        {/* Toast */}
        {toast && (
          <div
            className={`fixed top-4 right-4 z-50 px-5 py-3 text-[10px] font-black tracking-[0.2em] uppercase shadow-lg transition-all duration-300 ${
              toast.type === "success"
                ? "bg-[#22c55e] text-white"
                : "bg-[#E50914] text-white"
            }`}
          >
            {toast.msg}
          </div>
        )}

        {/* Header */}
        <header className="border-b border-[#2A2A2A] bg-[#111111] px-6 py-4 flex items-center gap-3">
          <span className="text-[#E50914] text-[10px] font-black tracking-[0.3em] uppercase">
            Astra
          </span>
          <span className="text-[#333]">/</span>
          <span className="text-[#666] text-[10px] font-black tracking-[0.2em] uppercase">
            Membership Plans
          </span>
        </header>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-16">
            <p className="text-[#E50914] text-[10px] font-black tracking-[0.3em] uppercase mb-4">
              Upgrade Your Membership
            </p>
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white mb-4">
              Choose Your <span className="text-[#E50914]">Plan</span>
            </h1>
            <p className="text-[#555] text-sm max-w-md mx-auto">
              Secure checkout powered by Razorpay. No hidden fees.
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-[#111111] border border-[#2A2A2A] h-80 animate-pulse"
                />
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && fetchError && (
            <div className="text-center py-16">
              <p className="text-[#555] text-sm uppercase tracking-widest">
                Unable to load plans.{" "}
                <button
                  onClick={() => window.location.reload()}
                  className="text-[#E50914] hover:underline"
                >
                  Try again
                </button>
              </p>
            </div>
          )}

          {/* Plans grid */}
          {!loading && !fetchError && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {plans.map((plan, i) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className={`relative flex flex-col bg-[#111111] border-2 transition-all duration-300 ${
                    plan.popular
                      ? "border-[#E50914] shadow-2xl shadow-[#E50914]/20"
                      : "border-[#2A2A2A] hover:border-[#E50914]/40"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 inset-x-0 flex justify-center">
                      <span className="bg-[#E50914] text-white text-[10px] font-black tracking-[0.25em] uppercase px-6 py-1.5">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="p-8 flex flex-col flex-1">
                    {/* Name + duration */}
                    <div className="mb-6">
                      <p className="text-[#555] text-[10px] font-black tracking-[0.2em] uppercase mb-1">
                        {plan.duration}
                      </p>
                      <h2 className="text-2xl font-black uppercase tracking-wide text-white">
                        {plan.name}
                      </h2>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-1 mb-8">
                      <span className="text-[#E50914] text-xl font-black">₹</span>
                      <span className="text-5xl font-black text-white">
                        {plan.price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[#555] text-sm ml-1">
                        / {plan.duration.toLowerCase()}
                      </span>
                    </div>

                    <div className="h-px bg-[#2A2A2A] mb-8" />

                    {/* Features */}
                    <ul className="space-y-3 flex-1 mb-8">
                      {plan.features.map((f, fi) => (
                        <li key={fi} className="flex items-start gap-3 text-sm text-[#bbb]">
                          <span className="text-[#E50914] font-black mt-0.5 flex-shrink-0">✓</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Buy button */}
                    <button
                      onClick={() => handleBuy(plan.id)}
                      disabled={processingId !== null}
                      className={`w-full py-3.5 font-black tracking-widest uppercase text-sm transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                        plan.popular
                          ? "bg-[#E50914] hover:bg-[#C20812] text-white shadow-lg shadow-[#E50914]/30 disabled:bg-[#E50914]/50"
                          : "border border-[#E50914] text-[#E50914] hover:bg-[#E50914] hover:text-white disabled:opacity-40"
                      }`}
                    >
                      {processingId === plan.id ? (
                        <>
                          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Processing…
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                          </svg>
                          Buy Now
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Trust badge */}
          <p className="text-center text-[#333] text-[10px] font-black tracking-[0.15em] uppercase mt-10">
            🔒 Secured by Razorpay · 256-bit SSL
          </p>
        </main>
      </div>
    </ProtectedRoute>
  );
}
