"use client";

import { motion } from "framer-motion";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  index?: number;
}

export default function FeatureCard({
  icon,
  title,
  description,
  index = 0,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group relative bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#E50914]/60 p-8 transition-colors duration-300 overflow-hidden"
    >
      {/* Red left accent */}
      <div className="absolute inset-y-0 left-0 w-1 bg-transparent group-hover:bg-[#E50914] transition-colors duration-300" />

      <div className="text-5xl mb-6">{icon}</div>
      <h3 className="text-xl font-black uppercase tracking-wide text-white mb-3 group-hover:text-[#E50914] transition-colors duration-300">
        {title}
      </h3>
      <p className="text-[#666] leading-relaxed text-sm">{description}</p>
    </motion.div>
  );
}
