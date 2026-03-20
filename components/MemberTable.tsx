"use client";

import type { Member, MemberStatus } from "@/types";

interface Props {
  members: Member[];
}

const STATUS_CONFIG: Record<
  MemberStatus,
  { label: string; classes: string }
> = {
  active: {
    label: "Active",
    classes:
      "bg-[#052e16] text-[#22c55e] border border-[#22c55e]/30",
  },
  expired: {
    label: "Expired",
    classes: "bg-[#3b0000] text-[#E50914] border border-[#E50914]/30",
  },
  expiring_soon: {
    label: "Expiring Soon",
    classes:
      "bg-[#2d1a00] text-[#f59e0b] border border-[#f59e0b]/30",
  },
};

function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function MemberTable({ members }: Props) {
  if (members.length === 0) {
    return (
      <div className="p-16 text-center">
        <p className="text-[#444] text-sm tracking-wide">No members found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#2A2A2A]">
            {["Name", "Phone", "Plan", "Start Date", "Expiry Date", "Status"].map(
              (col) => (
                <th
                  key={col}
                  className="text-left text-[#555] text-[10px] font-black tracking-[0.2em] uppercase px-4 py-3 whitespace-nowrap"
                >
                  {col}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {members.map((m, i) => {
            const statusCfg =
              STATUS_CONFIG[m.status] ?? STATUS_CONFIG.expired;
            return (
              <tr
                key={m.id}
                className={`border-b border-[#1A1A1A] hover:bg-[#151515] transition-colors duration-150 ${
                  i % 2 === 0 ? "bg-[#0B0B0B]" : "bg-[#0e0e0e]"
                }`}
              >
                <td className="px-4 py-3 font-semibold text-white whitespace-nowrap">
                  {m.name}
                </td>
                <td className="px-4 py-3 text-[#888] whitespace-nowrap">
                  {m.phone}
                </td>
                <td className="px-4 py-3 text-[#888] whitespace-nowrap">
                  {m.plan_name}
                </td>
                <td className="px-4 py-3 text-[#888] whitespace-nowrap">
                  {formatDate(m.start_date)}
                </td>
                <td className="px-4 py-3 text-[#888] whitespace-nowrap">
                  {formatDate(m.end_date)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-[10px] font-black tracking-wider uppercase px-3 py-1 ${statusCfg.classes}`}
                  >
                    {statusCfg.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
