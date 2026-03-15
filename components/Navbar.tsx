"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/plans", label: "Plans" },
  { href: "/trainers", label: "Trainers" },
  { href: "/transformations", label: "Transformations" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0B0B0B]/95 backdrop-blur-md shadow-2xl shadow-black/60 border-b border-[#2A2A2A]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-black tracking-widest uppercase text-white">
              AST<span className="text-[#E50914]">RA</span>
            </span>
            <span className="hidden sm:block text-[10px] tracking-[0.2em] text-[#888] uppercase border-l border-[#333] pl-2">
              The Real Gym
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-[11px] font-semibold tracking-[0.15em] uppercase transition-colors duration-200 hover:text-[#E50914] ${
                  pathname === link.href ? "text-[#E50914]" : "text-gray-300"
                }`}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#E50914] rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-4">
            <Link
              href="/join"
              className="hidden lg:block bg-[#E50914] hover:bg-[#C20812] text-white px-6 py-2.5 text-[11px] font-black tracking-widest uppercase transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-[#E50914]/20"
            >
              Join Now
            </Link>

            {/* Hamburger */}
            <button
              className="lg:hidden flex flex-col justify-center gap-1.5 w-8 h-8 text-white"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle navigation"
              aria-expanded={isOpen}
            >
              <span
                className={`block h-px w-full bg-white origin-center transition-all duration-300 ${
                  isOpen ? "rotate-45 translate-y-[7px]" : ""
                }`}
              />
              <span
                className={`block h-px w-full bg-white transition-all duration-300 ${
                  isOpen ? "opacity-0 scale-x-0" : ""
                }`}
              />
              <span
                className={`block h-px w-full bg-white origin-center transition-all duration-300 ${
                  isOpen ? "-rotate-45 -translate-y-[7px]" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden bg-[#111] border-t border-[#2A2A2A]"
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className={`block text-sm font-semibold tracking-[0.15em] uppercase ${
                      pathname === link.href
                        ? "text-[#E50914]"
                        : "text-gray-300"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                href="/join"
                className="block bg-[#E50914] text-white px-4 py-3 text-sm font-black tracking-widest uppercase text-center mt-2"
              >
                Join Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
