"use client";

import { useEffect, useState } from "react";
import PlanCard from "@/components/PlanCard";
import { apiClient } from "@/services/apiClient";
import type { Plan } from "@/types";

const POPULAR_PLAN_NAME = "Quarterly";

interface ApiPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
}

interface ApiPlansResponse {
  success: boolean;
  count: number;
  data: ApiPlan[];
}

export default function PlansSection() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    apiClient
      .get<ApiPlansResponse>("/api/plans")
      .then((res) => {
        const mapped: Plan[] = res.data.data.map((plan) => ({
          ...plan,
          popular: plan.name === POPULAR_PLAN_NAME,
        }));
        setPlans(mapped);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start mt-8">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="bg-[#1A1A1A] border border-[#2A2A2A] p-8 h-80 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-[#555] text-sm uppercase tracking-widest">
          Unable to load plans right now. Please try again later or{" "}
          <a href="/contact" className="text-[#E50914] hover:underline">
            contact us
          </a>
          .
        </p>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-[#555] text-sm uppercase tracking-widest">
          No plans available at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start mt-8">
      {plans.map((plan, i) => (
        <PlanCard key={plan.id} plan={plan} index={i} />
      ))}
    </div>
  );
}
