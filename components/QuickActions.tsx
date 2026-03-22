"use client";

import Link from "next/link";

const ACTIONS = [
  {
    href: "/member/scan",
    label: "Check In",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m0 14v1M4 12H3m18 0h-1M6.34 6.34l-.71-.71M18.36 18.36l-.71-.71M6.34 17.66l-.71.71M18.36 5.64l-.71.71M12 8a4 4 0 100 8 4 4 0 000-8z" />
      </svg>
    ),
    accent: "border-[#E50914] bg-[#E50914] hover:bg-[#C20812] text-white",
  },
  {
    href: "/member/progress",
    label: "Log Weight",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M3 12h18M3 18h18" />
        <circle cx="7" cy="6" r="1.5" fill="currentColor" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        <circle cx="17" cy="18" r="1.5" fill="currentColor" />
      </svg>
    ),
    accent:
      "border-[#2A2A2A] bg-[#111111] hover:border-[#E50914] hover:text-[#E50914] text-[#888]",
  },
  {
    href: "/member/workout",
    label: "View Workout",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h10M4 18h7" />
      </svg>
    ),
    accent:
      "border-[#2A2A2A] bg-[#111111] hover:border-[#E50914] hover:text-[#E50914] text-[#888]",
  },
] as const;

export default function QuickActions() {
  return (
    <div className="bg-[#111111] border border-[#2A2A2A] p-6">
      <p className="text-[10px] font-black tracking-[0.2em] uppercase text-[#555] mb-4">
        Quick Actions
      </p>
      <div className="grid grid-cols-3 gap-3">
        {ACTIONS.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={`flex flex-col items-center justify-center gap-2.5 border px-4 py-5
                        text-center transition-colors duration-200 ${action.accent}`}
          >
            {action.icon}
            <span className="text-[9px] font-black tracking-[0.15em] uppercase">
              {action.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
