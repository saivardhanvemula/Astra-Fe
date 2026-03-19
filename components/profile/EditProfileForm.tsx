"use client";

import { useState, FormEvent, ChangeEvent, useRef } from "react";
import type { UserProfile } from "@/types";

interface FormState {
  name: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  fitness_goal: string;
}

interface FormErrors {
  name?: string;
  age?: string;
  height?: string;
  weight?: string;
}

interface Props {
  profile: UserProfile;
  onSave: (data: Partial<UserProfile>, pictureFile?: File) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

function validate(f: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!f.name.trim()) errors.name = "Name is required.";
  if (f.age && (isNaN(+f.age) || +f.age < 1 || +f.age > 120))
    errors.age = "Enter a valid age (1–120).";
  if (f.height && (isNaN(+f.height) || +f.height < 50 || +f.height > 280))
    errors.height = "Enter height in cm (50–280).";
  if (f.weight && (isNaN(+f.weight) || +f.weight < 20 || +f.weight > 500))
    errors.weight = "Enter weight in kg (20–500).";
  return errors;
}

export default function EditProfileForm({
  profile,
  onSave,
  onCancel,
  loading,
}: Props) {
  const [form, setForm] = useState<FormState>({
    name: profile.name ?? "",
    age: profile.age != null ? String(profile.age) : "",
    gender: profile.gender ?? "",
    height: profile.height != null ? String(profile.height) : "",
    weight: profile.weight != null ? String(profile.weight) : "",
    fitness_goal: profile.fitness_goal ?? "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [pictureFile, setPictureFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    profile.profile_picture ?? null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    const updated = { ...form, [key]: value };
    setForm(updated);
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPictureFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    const data: Partial<UserProfile> = {
      name: form.name.trim(),
      ...(form.age && { age: Number(form.age) }),
      ...(form.gender && { gender: form.gender }),
      ...(form.height && { height: Number(form.height) }),
      ...(form.weight && { weight: Number(form.weight) }),
      ...(form.fitness_goal && { fitness_goal: form.fitness_goal }),
    };
    await onSave(data, pictureFile ?? undefined);
  }

  const inputCls = (field: keyof FormErrors) =>
    `w-full bg-[#1A1A1A] border text-white placeholder-[#444] px-4 py-3 outline-none transition-colors duration-200 text-sm ${
      errors[field]
        ? "border-[#E50914]"
        : "border-[#2A2A2A] focus:border-[#E50914]"
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Profile picture */}
      <div>
        <label className="block text-[#888] text-[10px] font-black tracking-[0.2em] uppercase mb-3">
          Profile Picture
        </label>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center overflow-hidden shrink-0">
            {preview ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={preview}
                alt="preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl font-black text-[#333]">
                {form.name.charAt(0).toUpperCase() || "?"}
              </span>
            )}
          </div>
          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="border border-[#2A2A2A] hover:border-[#E50914] text-[#888] hover:text-[#E50914] text-[10px] font-black tracking-[0.2em] uppercase px-4 py-2 transition-colors duration-200"
            >
              Choose Photo
            </button>
            {pictureFile && (
              <p className="text-[#555] text-[11px] mt-1 truncate max-w-[160px]">
                {pictureFile.name}
              </p>
            )}
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Full Name */}
      <div>
        <label className="block text-[#888] text-[10px] font-black tracking-[0.2em] uppercase mb-2">
          Full Name *
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setField("name", e.target.value)}
          placeholder="Your full name"
          className={inputCls("name")}
        />
        {errors.name && (
          <p className="text-[#E50914] text-[11px] mt-1">{errors.name}</p>
        )}
      </div>

      {/* Age & Gender */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[#888] text-[10px] font-black tracking-[0.2em] uppercase mb-2">
            Age
          </label>
          <input
            type="number"
            min={1}
            max={120}
            value={form.age}
            onChange={(e) => setField("age", e.target.value)}
            placeholder="25"
            className={inputCls("age")}
          />
          {errors.age && (
            <p className="text-[#E50914] text-[11px] mt-1">{errors.age}</p>
          )}
        </div>
        <div>
          <label className="block text-[#888] text-[10px] font-black tracking-[0.2em] uppercase mb-2">
            Gender
          </label>
          <input
            type="text"
            value={form.gender}
            onChange={(e) => setField("gender", e.target.value)}
            placeholder="e.g. male, female..."
            className="w-full bg-[#1A1A1A] border border-[#2A2A2A] focus:border-[#E50914] text-white placeholder-[#444] px-4 py-3 outline-none transition-colors duration-200 text-sm"
          />
        </div>
      </div>

      {/* Height & Weight */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[#888] text-[10px] font-black tracking-[0.2em] uppercase mb-2">
            Height (cm)
          </label>
          <input
            type="number"
            value={form.height}
            onChange={(e) => setField("height", e.target.value)}
            placeholder="170"
            className={inputCls("height")}
          />
          {errors.height && (
            <p className="text-[#E50914] text-[11px] mt-1">{errors.height}</p>
          )}
        </div>
        <div>
          <label className="block text-[#888] text-[10px] font-black tracking-[0.2em] uppercase mb-2">
            Weight (kg)
          </label>
          <input
            type="number"
            value={form.weight}
            onChange={(e) => setField("weight", e.target.value)}
            placeholder="70"
            className={inputCls("weight")}
          />
          {errors.weight && (
            <p className="text-[#E50914] text-[11px] mt-1">{errors.weight}</p>
          )}
        </div>
      </div>

      {/* Fitness Goal */}
      <div>
        <label className="block text-[#888] text-[10px] font-black tracking-[0.2em] uppercase mb-2">
          Fitness Goal
        </label>
        <input
          type="text"
          value={form.fitness_goal}
          onChange={(e) => setField("fitness_goal", e.target.value)}
          placeholder="e.g. weight loss, muscle gain..."
          className="w-full bg-[#1A1A1A] border border-[#2A2A2A] focus:border-[#E50914] text-white placeholder-[#444] px-4 py-3 outline-none transition-colors duration-200 text-sm"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 border border-[#2A2A2A] hover:border-[#555] text-[#666] hover:text-[#888] text-[10px] font-black tracking-[0.2em] uppercase py-3 transition-all duration-200 disabled:opacity-40"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-[#E50914] hover:bg-[#C20812] disabled:opacity-40 disabled:cursor-not-allowed text-white text-[10px] font-black tracking-[0.2em] uppercase py-3 transition-all duration-200"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
