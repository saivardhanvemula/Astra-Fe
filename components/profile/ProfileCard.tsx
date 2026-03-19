"use client";

import Image from "next/image";
import type { UserProfile } from "@/types";

interface Props {
  profile: UserProfile;
  onEditClick: () => void;
  completionPercent: number;
}

const GOAL_LABELS: Record<string, string> = {
  weight_loss: "Weight Loss",
  muscle_gain: "Muscle Gain",
  endurance: "Endurance",
  flexibility: "Flexibility",
  general_fitness: "General Fitness",
};

export default function ProfileCard({
  profile,
  onEditClick,
  completionPercent,
}: Props) {
  const initials = profile.name?.charAt(0).toUpperCase() ?? "?";

  return (
    <div className="bg-[#111111] border border-[#2A2A2A]">
      {/* Completion header */}
      <div className="border-b border-[#2A2A2A] px-5 py-3 flex items-center justify-between">
        <p className="text-[#555] text-[10px] font-black tracking-[0.2em] uppercase">
          Profile Completion
        </p>
        <span className="text-[#E50914] text-[10px] font-black">
          {completionPercent}%
        </span>
      </div>
      {/* Progress bar */}
      <div className="h-0.5 bg-[#1A1A1A]">
        <div
          className="h-full bg-[#E50914] transition-all duration-700"
          style={{ width: `${completionPercent}%` }}
        />
      </div>

      <div className="p-6">
        {/* Avatar + identity */}
        <div className="flex items-center gap-4 mb-7">
          <div className="relative w-20 h-20 bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center overflow-hidden shrink-0">
            {profile.profile_picture ? (
              <Image
                src={profile.profile_picture}
                alt={profile.name}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <span className="text-3xl font-black text-[#333]">
                {initials}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight text-white leading-tight">
              {profile.name}
            </h2>
            {profile.email && (
              <p className="text-[#555] text-xs mt-1">{profile.email}</p>
            )}
            <div className="mt-2">
              <span className="text-[10px] font-black tracking-[0.15em] uppercase px-2.5 py-1 bg-[#1A1A1A] text-[#555] border border-[#2A2A2A]">
                {profile.role ?? "Member"}
              </span>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          {[
            {
              label: "Age",
              value: profile.age ? `${profile.age} yrs` : "—",
            },
            {
              label: "Gender",
              value: profile.gender
                ? profile.gender.charAt(0).toUpperCase() +
                  profile.gender.slice(1)
                : "—",
            },
            {
              label: "Height",
              value: profile.height ? `${profile.height} cm` : "—",
            },
            {
              label: "Weight",
              value: profile.weight ? `${profile.weight} kg` : "—",
            },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-[#0B0B0B] border border-[#1A1A1A] p-3"
            >
              <p className="text-[#555] text-[9px] font-black tracking-[0.2em] uppercase mb-1">
                {label}
              </p>
              <p className="text-white text-sm font-bold">{value}</p>
            </div>
          ))}
        </div>

        {/* Fitness goal */}
        {profile.fitness_goal && (
          <div className="bg-[#0B0B0B] border border-[#1A1A1A] p-3 mb-6">
            <p className="text-[#555] text-[9px] font-black tracking-[0.2em] uppercase mb-1">
              Fitness Goal
            </p>
            <p className="text-white text-sm font-bold">
              {GOAL_LABELS[profile.fitness_goal] ?? profile.fitness_goal}
            </p>
          </div>
        )}

        <button
          onClick={onEditClick}
          className="w-full border border-[#E50914] text-[#E50914] hover:bg-[#E50914] hover:text-white text-[10px] font-black tracking-[0.2em] uppercase py-3 transition-all duration-200"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}
