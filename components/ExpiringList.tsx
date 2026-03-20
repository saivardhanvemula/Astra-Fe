import type { ExpiringMember } from "@/types";

interface Props {
  data: ExpiringMember[];
  loading?: boolean;
  error?: string | null;
}

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function ExpiringList({ data, loading, error }: Props) {
  return (
    <div className="bg-[#111111] border border-[#2A2A2A] p-6 h-full">
      <p className="text-[#555] text-[10px] font-black tracking-[0.2em] uppercase mb-6">
        Expiring Soon
      </p>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between items-center py-3 border-b border-[#1A1A1A]">
              <div className="h-4 w-32 bg-[#1A1A1A] animate-pulse" />
              <div className="h-4 w-20 bg-[#1A1A1A] animate-pulse" />
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="text-[#E50914] text-[10px] font-black tracking-[0.2em] uppercase">
          {error}
        </p>
      ) : data.length === 0 ? (
        <p className="text-[#333] text-[10px] font-black tracking-[0.2em] uppercase py-4">
          No members expiring soon
        </p>
      ) : (
        <div>
          {/* Header row */}
          <div className="flex justify-between mb-2 pb-2 border-b border-[#1A1A1A]">
            <span className="text-[#444] text-[9px] font-black tracking-[0.2em] uppercase">
              Name
            </span>
            <span className="text-[#444] text-[9px] font-black tracking-[0.2em] uppercase">
              Expires
            </span>
          </div>
          <ul>
            {data.map((m) => {
              const urgent = m.days_remaining <= 3;
              const warning = m.days_remaining <= 7 && !urgent;
              return (
                <li
                  key={m.id}
                  className="flex items-center justify-between py-3 border-b border-[#1A1A1A] last:border-0 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Urgency dot */}
                    <span
                      className={`shrink-0 w-1.5 h-1.5 rounded-full ${
                        urgent
                          ? "bg-[#E50914]"
                          : warning
                          ? "bg-[#f59e0b]"
                          : "bg-[#2A2A2A]"
                      }`}
                    />
                    <span className="text-white text-sm font-black truncate">
                      {m.name}
                    </span>
                  </div>
                  <div className="flex flex-col items-end shrink-0 ml-4">
                    <span
                      className={`text-xs font-black ${
                        urgent
                          ? "text-[#E50914]"
                          : warning
                          ? "text-[#f59e0b]"
                          : "text-[#888]"
                      }`}
                    >
                      {fmtDate(m.expiry_date)}
                    </span>
                    <span
                      className={`text-[9px] font-black tracking-[0.1em] uppercase ${
                        urgent
                          ? "text-[#E50914]/70"
                          : warning
                          ? "text-[#f59e0b]/70"
                          : "text-[#444]"
                      }`}
                    >
                      {m.days_remaining === 0
                        ? "Today"
                        : m.days_remaining === 1
                        ? "Tomorrow"
                        : `${m.days_remaining}d left`}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
