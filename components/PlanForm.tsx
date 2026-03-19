"use client";

import { useState, FormEvent } from "react";
import { createPlan } from "@/services/adminService";
import type { AdminPlan } from "@/types";

interface Props {
  onCreated: (plan: AdminPlan) => void;
}

export default function PlanForm({ onCreated }: Props) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [durationDays, setDurationDays] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid =
    name.trim().length > 0 &&
    Number(price) > 0 &&
    Number(durationDays) > 0;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    setError(null);
    try {
      const plan = await createPlan({
        name: name.trim(),
        price: Number(price),
        duration_days: Number(durationDays),
      });
      onCreated(plan);
      setName("");
      setPrice("");
      setDurationDays("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create plan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-[#E50914]/10 border border-[#E50914]/40 text-[#E50914] text-xs px-4 py-3 tracking-wide">
          {error}
        </div>
      )}

      <div>
        <label className="block text-[#888] text-[10px] font-black tracking-[0.2em] uppercase mb-2">
          Plan Name
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Monthly"
          className="w-full bg-[#1A1A1A] border border-[#2A2A2A] focus:border-[#E50914] text-white placeholder-[#444] px-4 py-3 outline-none transition-colors duration-200 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[#888] text-[10px] font-black tracking-[0.2em] uppercase mb-2">
            Price (₹)
          </label>
          <input
            type="number"
            required
            min={1}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="2999"
            className="w-full bg-[#1A1A1A] border border-[#2A2A2A] focus:border-[#E50914] text-white placeholder-[#444] px-4 py-3 outline-none transition-colors duration-200 text-sm"
          />
        </div>
        <div>
          <label className="block text-[#888] text-[10px] font-black tracking-[0.2em] uppercase mb-2">
            Duration (days)
          </label>
          <input
            type="number"
            required
            min={1}
            value={durationDays}
            onChange={(e) => setDurationDays(e.target.value)}
            placeholder="30"
            className="w-full bg-[#1A1A1A] border border-[#2A2A2A] focus:border-[#E50914] text-white placeholder-[#444] px-4 py-3 outline-none transition-colors duration-200 text-sm"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !isValid}
        className="w-full bg-[#E50914] hover:bg-[#C20812] disabled:opacity-40 disabled:cursor-not-allowed text-white font-black tracking-widest uppercase text-[11px] py-3 transition-all duration-200"
      >
        {loading ? "Creating..." : "Create Plan"}
      </button>
    </form>
  );
}
