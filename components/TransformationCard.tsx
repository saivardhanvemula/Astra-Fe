"use client";

import { motion } from "framer-motion";
import type { Transformation } from "@/types";

interface TransformationCardProps {
  transformation: Transformation;
  index?: number;
}

export default function TransformationCard({
  transformation,
  index = 0,
}: TransformationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.09 }}
      className="group bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#E50914]/50 overflow-hidden transition-all duration-300"
    >
      {/* Before / After grid */}
      <div className="grid grid-cols-2 gap-0.5 bg-[#0B0B0B]">
        {/* Before */}
        <div className="relative aspect-square bg-[#111] overflow-hidden">
          {transformation.beforeImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={transformation.beforeImage}
              alt={`${transformation.memberName} before`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2A2A2A] to-[#111]">
              <span className="text-4xl font-black text-[#333] select-none">
                B
              </span>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 bg-black/70 text-[10px] font-black uppercase tracking-[0.2em] text-[#888] py-1.5 text-center">
            Before
          </div>
        </div>

        {/* After */}
        <div className="relative aspect-square bg-[#111] overflow-hidden">
          {transformation.afterImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={transformation.afterImage}
              alt={`${transformation.memberName} after`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#E50914]/25 to-[#111]">
              <span className="text-4xl font-black text-[#E50914]/50 select-none">
                A
              </span>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 bg-[#E50914]/85 text-[10px] font-black uppercase tracking-[0.2em] text-white py-1.5 text-center">
            After
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white font-black uppercase tracking-wide text-[15px]">
            {transformation.memberName}
          </h3>
          <span className="bg-[#E50914]/10 text-[#E50914] text-[10px] font-black px-3 py-1 uppercase tracking-wider flex-shrink-0 ml-2">
            {transformation.duration}
          </span>
        </div>
        <p className="text-[#666] text-sm leading-relaxed">
          {transformation.description}
        </p>
        {transformation.weightLost && (
          <p className="mt-3 text-[#E50914] text-sm font-black uppercase tracking-wider">
            ↓ {transformation.weightLost}
          </p>
        )}
      </div>
    </motion.div>
  );
}
