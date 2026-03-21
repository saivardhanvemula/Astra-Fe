"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { submitMemberForm } from "@/services/memberService";
import { apiClient } from "@/services/apiClient";
import type { MemberFormData } from "@/types";

const fitnessGoals = [
  "Weight Loss",
  "Muscle Building",
  "Strength Training",
  "General Fitness",
  "Endurance Training",
  "Flexibility & Yoga",
  "Athletic Performance",
  "Post-Injury Rehab",
];

interface PlanOption {
  id: string;
  label: string;
  name: string;
}

const initialForm: MemberFormData = {
  name: "sai vardhan",
  phone: "8977715124",
  email: "sivardhanvemulamncl@gmail.com",
  age: "21",
  gender: "Male",
  fitness_goal: "Strength Training",
  selected_plan: "",
};

type FormErrors = Partial<Record<keyof MemberFormData, string>>;

function validate(data: MemberFormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.name.trim()) errors.name = "Full name is required.";
  else if (data.name.trim().length < 2)
    errors.name = "Name must be at least 2 characters.";

  if (!data.phone.trim()) errors.phone = "Phone number is required.";
  else if (!/^[6-9]\d{9}$/.test(data.phone.trim()))
    errors.phone = "Enter a valid 10-digit Indian mobile number.";

  if (!data.email.trim()) errors.email = "Email address is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()))
    errors.email = "Enter a valid email address.";

  if (!data.age) errors.age = "Age is required.";
  else if (Number(data.age) < 14 || Number(data.age) > 80)
    errors.age = "Age must be between 14 and 80.";

  if (!data.gender) errors.gender = "Please select your gender.";
  if (!data.fitness_goal)
    errors.fitness_goal = "Please select a fitness goal.";
  if (!data.selected_plan) errors.selected_plan = "Please select a plan.";

  return errors;
}

export default function JoinForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [plans, setPlans] = useState<PlanOption[]>([]);
  const [form, setForm] = useState<MemberFormData>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof MemberFormData, boolean>>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // Fetch plans from API
  useEffect(() => {
    apiClient
      .get<{ success: boolean; data: { id: string; name: string; price: number; duration: string }[] }>("/api/plans")
      .then((res) => {
        const mapped = res.data.data.map((p) => ({
          id: p.id,
          label: `${p.name} – ₹${p.price.toLocaleString("en-IN")}`,
          name: p.name,
        }));
        setPlans(mapped);

        // Default to monthly plan unless query param overrides it
        const param = searchParams.get("plan");
        if (param) {
          const match = mapped.find((p) => p.id === param);
          if (match) setForm((f) => ({ ...f, selected_plan: match.id }));
        } else {
          const monthly = mapped.find((p) =>
            p.name.toLowerCase().includes("month")
          );
          if (monthly) setForm((f) => ({ ...f, selected_plan: monthly.id }));
        }
      })
      .catch(() => {});
  }, [searchParams]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (touched[name as keyof MemberFormData]) {
      setErrors(validate({ ...form, [name]: value }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors(validate(form));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = Object.keys(form).reduce(
      (acc, k) => ({ ...acc, [k]: true }),
      {} as typeof touched
    );
    setTouched(allTouched);
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    setApiError("");
    try {
      await submitMemberForm(form);
      const planParam = form.selected_plan ? `?plan=${form.selected_plan}` : "";
      router.push(`/member/plans${planParam}`);
    } catch (err: unknown) {
      setApiError(
        err instanceof Error ? err.message : "Submission failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: keyof MemberFormData) =>
    `w-full bg-[#111] border px-4 py-3.5 text-white text-sm placeholder-[#444] outline-none transition-colors duration-200 focus:border-[#E50914] ${
      touched[field] && errors[field]
        ? "border-red-500"
        : "border-[#2A2A2A] hover:border-[#444]"
    }`;

  return (
    <motion.form
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      noValidate
      className="bg-[#1A1A1A] border border-[#2A2A2A] p-8 sm:p-10"
    >
      <AnimatePresence>
        {apiError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 text-sm"
          >
            {apiError}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="sm:col-span-2">
          <label className="block text-[11px] font-bold tracking-[0.2em] uppercase text-[#888] mb-2">
            Full Name <span className="text-[#E50914]">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter your full name"
            className={inputClass("name")}
            autoComplete="name"
          />
          {touched.name && errors.name && (
            <p className="mt-1.5 text-red-400 text-xs">{errors.name}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-[11px] font-bold tracking-[0.2em] uppercase text-[#888] mb-2">
            Phone Number <span className="text-[#E50914]">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="10-digit mobile number"
            className={inputClass("phone")}
            autoComplete="tel"
            maxLength={10}
          />
          {touched.phone && errors.phone && (
            <p className="mt-1.5 text-red-400 text-xs">{errors.phone}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-[11px] font-bold tracking-[0.2em] uppercase text-[#888] mb-2">
            Email Address <span className="text-[#E50914]">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="your@email.com"
            className={inputClass("email")}
            autoComplete="email"
          />
          {touched.email && errors.email && (
            <p className="mt-1.5 text-red-400 text-xs">{errors.email}</p>
          )}
        </div>

        {/* Age */}
        <div>
          <label className="block text-[11px] font-bold tracking-[0.2em] uppercase text-[#888] mb-2">
            Age <span className="text-[#E50914]">*</span>
          </label>
          <input
            type="number"
            name="age"
            value={form.age}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Your age (14–80)"
            className={inputClass("age")}
            min="14"
            max="80"
          />
          {touched.age && errors.age && (
            <p className="mt-1.5 text-red-400 text-xs">{errors.age}</p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-[11px] font-bold tracking-[0.2em] uppercase text-[#888] mb-2">
            Gender <span className="text-[#E50914]">*</span>
          </label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${inputClass("gender")} appearance-none`}
          >
            <option value="" disabled>
              Select gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </select>
          {touched.gender && errors.gender && (
            <p className="mt-1.5 text-red-400 text-xs">{errors.gender}</p>
          )}
        </div>

        {/* Fitness Goal */}
        <div>
          <label className="block text-[11px] font-bold tracking-[0.2em] uppercase text-[#888] mb-2">
            Fitness Goal <span className="text-[#E50914]">*</span>
          </label>
          <select
            name="fitness_goal"
            value={form.fitness_goal}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${inputClass("fitness_goal")} appearance-none`}
          >
            <option value="" disabled>
              Select your goal
            </option>
            {fitnessGoals.map((g) => (
              <option key={g} value={g.toLowerCase().replace(/ /g, "_")}>
                {g}
              </option>
            ))}
          </select>
          {touched.fitness_goal && errors.fitness_goal && (
            <p className="mt-1.5 text-red-400 text-xs">{errors.fitness_goal}</p>
          )}
        </div>

        {/* Plan */}
        <div>
          <label className="block text-[11px] font-bold tracking-[0.2em] uppercase text-[#888] mb-2">
            Membership Plan <span className="text-[#E50914]">*</span>
          </label>
          <select
            name="selected_plan"
            value={form.selected_plan}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${inputClass("selected_plan")} appearance-none`}
          >
            <option value="" disabled>
              Choose a plan
            </option>
            {plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
          {touched.selected_plan && errors.selected_plan && (
            <p className="mt-1.5 text-red-400 text-xs">
              {errors.selected_plan}
            </p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#E50914] hover:bg-[#C20812] disabled:bg-[#E50914]/50 disabled:cursor-not-allowed text-white py-4 font-black tracking-widest uppercase text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-[#E50914]/20"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
              </svg>
              Proceed to Payment
            </span>
          )}
        </button>
        <p className="text-[#555] text-xs text-center mt-4">
          By registering, you agree to our{" "}
          <a href="#" className="text-[#888] hover:text-white transition-colors">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-[#888] hover:text-white transition-colors">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </motion.form>
  );
}
