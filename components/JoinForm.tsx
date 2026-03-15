"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { submitMemberForm } from "@/lib/api";
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

const plans = [
  { id: "monthly", label: "Monthly – ₹999" },
  { id: "quarterly", label: "Quarterly – ₹2,499" },
  { id: "yearly", label: "Yearly – ₹7,999" },
];

const initialForm: MemberFormData = {
  name: "",
  phone: "",
  email: "",
  age: "",
  gender: "",
  fitness_goal: "",
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
  const searchParams = useSearchParams();
  const [form, setForm] = useState<MemberFormData>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof MemberFormData, boolean>>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  // Pre-fill plan from query string
  useEffect(() => {
    const plan = searchParams.get("plan");
    if (plan && plans.find((p) => p.id === plan)) {
      setForm((f) => ({ ...f, selected_plan: plan }));
    }
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
      setSuccess(true);
    } catch (err: unknown) {
      setApiError(
        err instanceof Error ? err.message : "Submission failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-20 px-8"
      >
        <div className="w-20 h-20 rounded-full bg-[#E50914]/15 flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">✓</span>
        </div>
        <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-4">
          Welcome to Astra!
        </h2>
        <p className="text-[#888] text-lg mb-8 max-w-md mx-auto leading-relaxed">
          Your registration was successful. Our team will contact you within 24
          hours to confirm your membership.
        </p>
        <button
          onClick={() => {
            setForm(initialForm);
            setTouched({});
            setErrors({});
            setSuccess(false);
          }}
          className="bg-[#E50914] hover:bg-[#C20812] text-white px-10 py-3 font-black tracking-widest uppercase text-sm transition-all duration-200 hover:scale-105"
        >
          Register Another
        </button>
      </motion.div>
    );
  }

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
            "Submit Registration"
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
