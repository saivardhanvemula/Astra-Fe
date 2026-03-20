import type { RecentMember } from "@/types";

interface Props {
  data: RecentMember[];
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

/** Derive initials from a name for the avatar placeholder */
function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export default function RecentMembers({ data, loading, error }: Props) {
  return (
    <div className="bg-[#111111] border border-[#2A2A2A] p-6 h-full">
      <p className="text-[#555] text-[10px] font-black tracking-[0.2em] uppercase mb-6">
        Recent Members
      </p>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-3 border-b border-[#1A1A1A]">
              <div className="w-9 h-9 bg-[#1A1A1A] animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-32 bg-[#1A1A1A] animate-pulse" />
                <div className="h-3 w-20 bg-[#1A1A1A] animate-pulse" />
              </div>
              <div className="h-3 w-16 bg-[#1A1A1A] animate-pulse" />
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="text-[#E50914] text-[10px] font-black tracking-[0.2em] uppercase">
          {error}
        </p>
      ) : data.length === 0 ? (
        <p className="text-[#333] text-[10px] font-black tracking-[0.2em] uppercase py-4">
          No recent members
        </p>
      ) : (
        <ul>
          {data.map((m, idx) => (
            <li
              key={`${m.name}-${idx}`}
              className="flex items-center gap-3 py-3 border-b border-[#1A1A1A] last:border-0 group"
            >
              {/* Avatar */}
              <div className="w-9 h-9 bg-[#1A1A1A] border border-[#2A2A2A] group-hover:border-[#E50914] flex items-center justify-center shrink-0 transition-colors duration-200">
                <span className="text-[#555] group-hover:text-[#E50914] text-[10px] font-black transition-colors duration-200">
                  {initials(m.name)}
                </span>
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-black truncate">{m.name}</p>
              </div>

              {/* Date */}
              <span className="text-[#555] text-[10px] font-black shrink-0">
                {fmtDate(m.created_at)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
