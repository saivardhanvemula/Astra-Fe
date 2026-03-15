"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Plan } from "@/types";

interface PlanCardProps {
  plan: Plan;
  index?: number;
}

export default function PlanCard({ plan, index = 0 }: PlanCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.13 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className={`relative flex flex-col bg-[#1A1A1A] border-2 transition-all duration-300 ${
        plan.popular
          ? "border-[#E50914] shadow-2xl shadow-[#E50914]/20"
          : "border-[#2A2A2A] hover:border-[#E50914]/50"
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
        {/* Header */}
        <div className="mb-6">
          <p className="text-[#555] text-[11px] font-bold tracking-[0.2em] uppercase mb-1">
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

        {/* Divider */}
        <div className="h-px bg-[#2A2A2A] mb-8" />

        {/* Features */}
        <ul className="space-y-3 flex-1 mb-8">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-[#bbb]">
              <span className="text-[#E50914] font-black mt-0.5 flex-shrink-0 text-base leading-none">
                ✓
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <Link
          href={`/join?plan=${plan.id}`}
          className={`block text-center py-3.5 font-black tracking-widest uppercase text-sm transition-all duration-200 hover:scale-105 active:scale-95 ${
            plan.popular
              ? "bg-[#E50914] text-white hover:bg-[#C20812] shadow-lg shadow-[#E50914]/30"
              : "border border-[#E50914] text-[#E50914] hover:bg-[#E50914] hover:text-white"
          }`}
        >
          Get Started
        </Link>
      </div>
    </motion.div>
  );
}
