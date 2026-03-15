"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface CTASectionProps {
  tagline?: string;
  title: string;
  titleHighlight?: string;
  subtitle: string;
  ctaText?: string;
  ctaHref?: string;
  variant?: "dark" | "red";
}

export default function CTASection({
  tagline = "— Take Action —",
  title,
  titleHighlight,
  subtitle,
  ctaText = "Join Now",
  ctaHref = "/join",
  variant = "dark",
}: CTASectionProps) {
  const isRed = variant === "red";

  return (
    <section
      className={`py-28 relative overflow-hidden ${
        isRed ? "bg-[#E50914]" : "bg-[#0B0B0B]"
      }`}
    >
      {!isRed && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B] via-[#150101] to-[#0B0B0B]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] rounded-full bg-[#E50914]/10 blur-[100px] pointer-events-none" />
        </>
      )}

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {tagline && (
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className={`text-[11px] font-black tracking-[0.3em] uppercase mb-5 ${
              isRed ? "text-white/60" : "text-[#E50914]"
            }`}
          >
            {tagline}
          </motion.p>
        )}

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white mb-6 leading-none"
        >
          {title}
          {titleHighlight && (
            <>
              {" "}
              <span className={isRed ? "text-[#0B0B0B]" : "text-[#E50914]"}>
                {titleHighlight}
              </span>
            </>
          )}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`text-lg mb-10 max-w-2xl mx-auto leading-relaxed ${
            isRed ? "text-white/75" : "text-[#777]"
          }`}
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link
            href={ctaHref}
            className={`inline-block px-14 py-4 font-black tracking-widest uppercase text-sm transition-all duration-200 hover:scale-105 active:scale-95 ${
              isRed
                ? "bg-white text-[#E50914] hover:bg-gray-100 shadow-xl"
                : "bg-[#E50914] text-white hover:bg-[#C20812] shadow-xl shadow-[#E50914]/25"
            }`}
          >
            {ctaText}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
