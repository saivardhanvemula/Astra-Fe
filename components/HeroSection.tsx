"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface HeroSectionProps {
  tagline?: string;
  title: string;
  titleHighlight?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  fullScreen?: boolean;
  showScroll?: boolean;
}

export default function HeroSection({
  tagline,
  title,
  titleHighlight,
  subtitle,
  ctaText = "Join Now",
  ctaHref = "/join",
  secondaryCtaText,
  secondaryCtaHref,
  fullScreen = true,
  showScroll = true,
}: HeroSectionProps) {
  return (
    <section
      className={`relative flex items-center justify-center overflow-hidden bg-[#0B0B0B] ${
        fullScreen ? "min-h-screen" : "py-36"
      }`}
    >
      {/* Layered background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B0B0B] via-[#150101] to-[#0B0B0B]" />

      {/* Grid lines overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(#E50914 1px, transparent 1px),
            linear-gradient(90deg, #E50914 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Red ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-[#E50914]/8 blur-[120px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {tagline && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <span className="h-px w-8 bg-[#E50914]" />
            <span className="text-[#E50914] text-[11px] font-black tracking-[0.35em] uppercase">
              {tagline}
            </span>
            <span className="h-px w-8 bg-[#E50914]" />
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl sm:text-7xl lg:text-9xl font-black uppercase tracking-tight text-white leading-none mb-6"
        >
          {title}
          {titleHighlight && (
            <>
              {" "}
              <span className="text-[#E50914]">{titleHighlight}</span>
            </>
          )}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="text-lg sm:text-xl text-[#888] max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href={ctaHref}
            className="bg-[#E50914] hover:bg-[#C20812] text-white px-10 py-4 font-black tracking-widest uppercase text-sm transition-all duration-200 hover:scale-105 active:scale-95 shadow-xl shadow-[#E50914]/25"
          >
            {ctaText}
          </Link>
          {secondaryCtaText && secondaryCtaHref && (
            <Link
              href={secondaryCtaHref}
              className="border border-white/25 hover:border-white/60 text-white px-10 py-4 font-black tracking-widest uppercase text-sm transition-all duration-200 hover:bg-white/5"
            >
              {secondaryCtaText}
            </Link>
          )}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      {fullScreen && showScroll && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[#444] text-[10px] tracking-[0.25em] uppercase">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="w-5 h-8 border border-white/20 rounded-full flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-2 bg-[#E50914] rounded-full" />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
