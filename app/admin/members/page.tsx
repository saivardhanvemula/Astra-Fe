"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminShell from "@/components/AdminShell";
import MemberTable from "@/components/MemberTable";
import { getMembers } from "@/services/adminService";
import type { Member, MemberStatus } from "@/types";

const STAT_FILTERS: { label: string; status?: MemberStatus }[] = [
  { label: "Total" },
  { label: "Active", status: "active" },
  { label: "Expired", status: "expired" },
  { label: "Expiring Soon", status: "expiring_soon" },
];

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<MemberStatus | "all">("all");

  useEffect(() => {
    getMembers()
      .then(setMembers)
      .catch((err: unknown) => {
        setError(
          err instanceof Error ? err.message : "Failed to load members."
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === "all" ? members : members.filter((m) => m.status === filter);

  function countBy(status?: MemberStatus) {
    return status ? members.filter((m) => m.status === status).length : members.length;
  }

  return (
    <AdminShell>
      {/* Page heading */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[#E50914] text-[10px] font-black tracking-[0.3em] uppercase mb-2">
            Admin
          </p>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
            Members
          </h1>
        </div>
        <Link
          href="/admin/members/add"
          className="bg-[#E50914] hover:bg-[#C20812] text-white text-[10px] font-black tracking-[0.2em] uppercase px-5 py-3 transition-colors duration-200 whitespace-nowrap"
        >
          + Add Member
        </Link>
      </div>

      {/* Stat cards / filter tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {STAT_FILTERS.map(({ label, status }) => {
          const key = status ?? "all";
          const count = countBy(status);
          const active = filter === key;
          return (
            <button
              key={label}
              onClick={() => setFilter(key as MemberStatus | "all")}
              className={`bg-[#111111] border p-4 text-left transition-colors duration-200 ${
                active ? "border-[#E50914]" : "border-[#2A2A2A] hover:border-[#333]"
              }`}
            >
              <p className="text-[#555] text-[10px] font-black tracking-[0.2em] uppercase mb-2">
                {label}
              </p>
              <p
                className={`text-2xl font-black ${
                  active ? "text-[#E50914]" : "text-white"
                }`}
              >
                {loading ? "—" : count}
              </p>
            </button>
          );
        })}
      </div>

      {/* Table card */}
      <div className="bg-[#111111] border border-[#2A2A2A]">
        <div className="border-b border-[#2A2A2A] px-4 py-3 flex items-center justify-between">
          <p className="text-[#555] text-[10px] font-black tracking-[0.2em] uppercase">
            {filter === "all" ? "All Members" : STAT_FILTERS.find((s) => (s.status ?? "all") === filter)?.label}
          </p>
          {!loading && (
            <span className="text-[#444] text-[10px] font-black">
              {filtered.length} record{filtered.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {loading ? (
          <div className="p-16 text-center">
            <p className="text-[#444] text-sm tracking-wide animate-pulse">
              Loading members...
            </p>
          </div>
        ) : error ? (
          <div className="p-8">
            <p className="text-[#E50914] text-sm">{error}</p>
          </div>
        ) : (
          <MemberTable members={filtered} />
        )}
      </div>
    </AdminShell>
  );
}
