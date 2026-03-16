"use client";

import { motion } from "framer-motion";
import type { Trainer } from "@/types";

interface TrainerCardProps {
  trainer: Trainer;
  index?: number;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Gradient colors keyed by index
const gradients = [
  "from-[#E50914]/30 to-[#1A1A1A]",
  "from-[#C20812]/30 to-[#1A1A1A]",
  "from-[#E50914]/20 to-[#2A2A2A]",
  "from-[#ff1c29]/25 to-[#111]",
];

export default function TrainerCard({ trainer, index = 0 }: TrainerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      className="group bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#E50914]/50 overflow-hidden transition-all duration-300"
    >
      {/* Image / Avatar area */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#111]">
        {trainer.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={trainer.image}
            alt={trainer.name}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${
              gradients[index % gradients.length]
            }`}
          >
            <span className="text-7xl font-black text-[#E50914]/40 select-none">
              {getInitials(trainer.name)}
            </span>
          </div>
        )}
        {/* Bottom gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/90 to-transparent" />
        {/* Specialization badge */}
        <div className="absolute bottom-3 left-4">
          <span className="text-[#E50914] text-[10px] font-black tracking-[0.2em] uppercase">
            {trainer.specialization}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-6">
        <h3 className="text-lg font-black uppercase tracking-wide text-white mb-1">
          {trainer.name}
        </h3>
        <p className="text-[#555] text-[11px] tracking-[0.15em] uppercase mb-4">
          {trainer.experience} Yrs Experience
        </p>
        <p className="text-[#777] text-sm leading-relaxed line-clamp-3">
          {trainer.bio}
        </p>
      </div>
    </motion.div>
  );
}
