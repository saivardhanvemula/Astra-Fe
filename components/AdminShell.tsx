"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Members", href: "/admin/members" },
  { label: "Plans", href: "/admin/plans" },
];

interface Props {
  children: React.ReactNode;
}

export default function AdminShell({ children }: Props) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <ProtectedRoute allowedRole="admin">
      <div className="min-h-screen bg-[#0B0B0B] text-white">
        {/* Top bar */}
        <header className="border-b border-[#2A2A2A] bg-[#111111] px-6 py-0 flex items-center justify-between">
          <div className="flex items-center gap-0">
            <span className="text-[#E50914] text-[10px] font-black tracking-[0.3em] uppercase pr-6 py-4 border-r border-[#2A2A2A]">
              Astra
            </span>
            <nav className="flex items-stretch">
              {NAV_ITEMS.map((item) => {
                const active =
                  item.href === "/admin/dashboard"
                    ? pathname === item.href
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-[10px] font-black tracking-[0.2em] uppercase px-5 py-4 border-r border-[#2A2A2A] transition-colors duration-200 ${
                      active
                        ? "text-white border-b-2 border-b-[#E50914]"
                        : "text-[#555] hover:text-[#888]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#444] text-[10px] font-black tracking-[0.15em] uppercase hidden sm:block">
              {user?.name}
            </span>
            <button
              onClick={logout}
              className="border border-[#2A2A2A] hover:border-[#E50914] text-[#888] hover:text-[#E50914] text-[10px] font-black tracking-[0.2em] uppercase px-4 py-2 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="max-w-6xl mx-auto px-6 py-10">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
