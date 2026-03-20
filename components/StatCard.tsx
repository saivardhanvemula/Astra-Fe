import { ReactNode } from "react";

interface Props {
  label: string;
  value: number | string | undefined | null;
  icon?: ReactNode;
  /** Tailwind text-color class for the value, e.g. "text-[#22c55e]" */
  valueColor?: string;
  loading?: boolean;
}

export default function StatCard({
  label,
  value,
  icon,
  valueColor = "text-white",
  loading = false,
}: Props) {
  return (
    <div className="group bg-[#111111] border border-[#2A2A2A] hover:border-[#E50914] p-6 transition-colors duration-200 cursor-default">
      <div className="flex items-start justify-between mb-4">
        <p className="text-[#555] text-[10px] font-black tracking-[0.2em] uppercase leading-tight">
          {label}
        </p>
        {icon && (
          <span className="text-[#333] group-hover:text-[#E50914] transition-colors duration-200">
            {icon}
          </span>
        )}
      </div>
      {loading ? (
        <div className="h-9 w-20 bg-[#1A1A1A] animate-pulse" />
      ) : (
        <p className={`text-4xl font-black tabular-nums ${valueColor}`}>
          {value ?? "—"}
        </p>
      )}
    </div>
  );
}
