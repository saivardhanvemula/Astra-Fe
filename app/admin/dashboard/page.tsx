"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute allowedRole="admin">
      <div className="min-h-screen bg-[#0B0B0B] text-white">
        {/* Top bar */}
        <header className="border-b border-[#2A2A2A] bg-[#111111] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[#E50914] text-[10px] font-black tracking-[0.3em] uppercase">
              Astra
            </span>
            <span className="text-[#333]">/</span>
            <span className="text-[#666] text-[10px] font-black tracking-[0.2em] uppercase">
              Admin
            </span>
          </div>
          <button
            onClick={logout}
            className="border border-[#2A2A2A] hover:border-[#E50914] text-[#888] hover:text-[#E50914] text-[10px] font-black tracking-[0.2em] uppercase px-4 py-2 transition-colors duration-200"
          >
            Logout
          </button>
        </header>

        {/* Main content */}
        <main className="max-w-6xl mx-auto px-6 py-16">
          <p className="text-[#E50914] text-[10px] font-black tracking-[0.3em] uppercase mb-4">
            Admin Dashboard
          </p>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white mb-3">
            Welcome,{" "}
            <span className="text-[#E50914]">{user?.name ?? "Admin"}</span>
          </h1>
          <p className="text-[#555] text-sm tracking-wide mb-16">
            {user?.email}
          </p>

          {/* Stat cards placeholder */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Members", value: "—" },
              { label: "Active Plans", value: "—" },
              { label: "Trainers", value: "—" },
              { label: "Revenue", value: "—" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-[#111111] border border-[#2A2A2A] p-6"
              >
                <p className="text-[#555] text-[10px] font-black tracking-[0.2em] uppercase mb-3">
                  {stat.label}
                </p>
                <p className="text-3xl font-black text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
