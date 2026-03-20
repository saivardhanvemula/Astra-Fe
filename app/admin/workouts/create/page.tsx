"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import WorkoutForm from "@/components/WorkoutForm";
import { createWorkoutPlan } from "@/services/workoutService";
import type { WorkoutDay } from "@/types";

interface FormData {
  name: string;
  days: WorkoutDay[];
}

export default function CreateWorkoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(data: FormData) {
    setLoading(true);
    setError(null);
    try {
      await createWorkoutPlan(data);
      router.push("/admin/workouts");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create plan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminShell>
      <div className="mb-8">
        <p className="text-[#E50914] text-[10px] font-black tracking-[0.3em] uppercase mb-2">
          Admin / Workouts
        </p>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
          Create Plan
        </h1>
      </div>

      {error && (
        <div className="bg-[#111111] border border-[#E50914] px-5 py-3 mb-6">
          <p className="text-[#E50914] text-[9px] font-black tracking-[0.2em] uppercase">
            {error}
          </p>
        </div>
      )}

      <WorkoutForm onSubmit={handleSubmit} loading={loading} />
    </AdminShell>
  );
}
