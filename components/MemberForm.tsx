"use client";

import { useState, FormEvent } from "react";
import type { AdminPlan } from "@/types";

export interface MemberFormValues {
  name: string;
  email: string;
  phone: string;
  plan_id: string;
  start_date: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  plan_id?: string;
  start_date?: string;
}

interface Props {
  plans: AdminPlan[];
  onSubmit: (data: MemberFormValues) => Promise<void>;
  loading: boolean;
}

const EMPTY: MemberFormValues = {
  name: "",
  email: "",
  phone: "",
  plan_id: "",
  start_date: "",
};

function validate(data: MemberFormValues): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = "Name is required.";
  if (!data.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!data.phone.trim()) {
    errors.phone = "Phone is required.";
  } else if (!/^\d{10}$/.test(data.phone.replace(/\s/g, ""))) {
    errors.phone = "Phone must be exactly 10 digits.";
  }
  if (!data.plan_id) errors.plan_id = "Select a plan.";
  if (!data.start_date) errors.start_date = "Start date is required.";
  return errors;
}

export default function MemberForm({ plans, onSubmit, loading }: Props) {
  const [form, setForm] = useState<MemberFormValues>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof MemberFormValues, boolean>>>({});

  function set(field: keyof MemberFormValues, value: string) {
    const updated = { ...form, [field]: value };
    setForm(updated);
    if (touched[field]) setErrors(validate(updated));
  }

  function blur(field: keyof MemberFormValues) {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate(form));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const allTouched = Object.fromEntries(
      Object.keys(EMPTY).map((k) => [k, true])
    ) as Record<keyof MemberFormValues, boolean>;
    setTouched(allTouched);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    await onSubmit(form);
  }

  const inputCls = (field: keyof FormErrors) =>
    `w-full bg-[#1A1A1A] border text-white placeholder-[#444] px-4 py-3 outline-none transition-colors duration-200 text-sm ${
      errors[field]
        ? "border-[#E50914]"
        : "border-[#2A2A2A] focus:border-[#E50914]"
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div>
        <label className="block text-[#888] text-[10px] font-black tracking-[0.2em] uppercase mb-2">
          Full Name
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          onBlur={() => blur("name")}
          placeholder="John Doe"
          className={inputCls("name")}
        />
        {errors.name && (
          <p className="text-[#E50914] text-[11px] mt-1">{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-[#888] text-[10px] font-black tracking-[0.2em] uppercase mb-2">
          Email
        </label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          onBlur={() => blur("email")}
          placeholder="john@example.com"
          className={inputCls("email")}
        />
        {errors.email && (
          <p className="text-[#E50914] text-[11px] mt-1">{errors.email}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-[#888] text-[10px] font-black tracking-[0.2em] uppercase mb-2">
          Phone
        </label>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => set("phone", e.target.value)}
          onBlur={() => blur("phone")}
          placeholder="9876543210"
          className={inputCls("phone")}
        />
        {errors.phone && (
          <p className="text-[#E50914] text-[11px] mt-1">{errors.phone}</p>
        )}
      </div>

      {/* Plan */}
      <div>
        <label className="block text-[#888] text-[10px] font-black tracking-[0.2em] uppercase mb-2">
          Membership Plan
        </label>
        <select
          value={form.plan_id}
          onChange={(e) => set("plan_id", e.target.value)}
          onBlur={() => blur("plan_id")}
          className={`w-full bg-[#1A1A1A] border text-white px-4 py-3 outline-none transition-colors duration-200 text-sm appearance-none cursor-pointer ${
            errors.plan_id
              ? "border-[#E50914]"
              : "border-[#2A2A2A] focus:border-[#E50914]"
          }`}
        >
          <option value="" disabled className="text-[#444]">
            Select a plan
          </option>
          {plans.map((p) => (
            <option key={p.id} value={p.id} className="bg-[#1A1A1A]">
              {p.name} — ₹{p.price.toLocaleString("en-IN")} / {p.duration_days}d
            </option>
          ))}
        </select>
        {errors.plan_id && (
          <p className="text-[#E50914] text-[11px] mt-1">{errors.plan_id}</p>
        )}
      </div>

      {/* Start Date */}
      <div>
        <label className="block text-[#888] text-[10px] font-black tracking-[0.2em] uppercase mb-2">
          Start Date
        </label>
        <input
          type="date"
          value={form.start_date}
          onChange={(e) => set("start_date", e.target.value)}
          onBlur={() => blur("start_date")}
          className={inputCls("start_date")}
        />
        {errors.start_date && (
          <p className="text-[#E50914] text-[11px] mt-1">{errors.start_date}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#E50914] hover:bg-[#C20812] disabled:opacity-40 disabled:cursor-not-allowed text-white font-black tracking-widest uppercase text-[11px] py-3 transition-all duration-200"
      >
        {loading ? "Adding Member..." : "Add Member"}
      </button>
    </form>
  );
}
