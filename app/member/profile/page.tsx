"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import ProfileCard from "@/components/profile/ProfileCard";
import EditProfileForm from "@/components/profile/EditProfileForm";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import {
  getProfile,
  updateProfile,
  uploadProfilePicture,
} from "@/services/profileService";
import type { UserProfile } from "@/types";

const GOAL_LABELS: Record<string, string> = {
  weight_loss: "Weight Loss",
  muscle_gain: "Muscle Gain",
  endurance: "Endurance",
  flexibility: "Flexibility",
  general_fitness: "General Fitness",
};

function computeCompletion(p: UserProfile): number {
  const checks = [
    p.name,
    p.age,
    p.gender,
    p.height,
    p.weight,
    p.fitness_goal,
    p.profile_picture,
  ];
  const filled = checks.filter((v) => v !== null && v !== undefined && v !== "").length;
  return Math.round((filled / checks.length) * 100);
}

export default function MemberProfilePage() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [pwOpen, setPwOpen] = useState(false);

  useEffect(() => {
    getProfile()
      .then(setProfile)
      .catch((err: unknown) => {
        setFetchError(
          err instanceof Error ? err.message : "Failed to load profile."
        );
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(data: Partial<UserProfile>, pictureFile?: File) {
    setSaving(true);
    setSaveError(null);
    try {
      let updated = await updateProfile(data);
      if (pictureFile) {
        const url = await uploadProfilePicture(pictureFile);
        updated = { ...updated, profile_picture: url };
      }
      setProfile(updated);
      setEditing(false);
      showToast("Profile updated successfully!");
    } catch (err: unknown) {
      setSaveError(
        err instanceof Error ? err.message : "Failed to save profile."
      );
    } finally {
      setSaving(false);
    }
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  const detailRows = profile
    ? [
        { label: "Full Name", value: profile.name },
        { label: "Age", value: profile.age ? `${profile.age} years` : "—" },
        {
          label: "Gender",
          value: profile.gender || "—",
        },
        { label: "Height", value: profile.height ? `${profile.height} cm` : "—" },
        { label: "Weight", value: profile.weight ? `${profile.weight} kg` : "—" },
        {
          label: "Fitness Goal",
          value: profile.fitness_goal || "—",
        },
        { label: "Role", value: profile.role ?? "Member" },
      ]
    : [];

  return (
    <ProtectedRoute allowedRole="member">
      <div className="min-h-screen bg-[#0B0B0B] text-white">
        {/* Header */}
        <header className="border-b border-[#2A2A2A] bg-[#111111] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase">
            <span className="text-[#E50914]">Astra</span>
            <span className="text-[#333]">/</span>
            <Link
              href="/member/dashboard"
              className="text-[#555] hover:text-[#888] transition-colors"
            >
              Dashboard
            </Link>
            <span className="text-[#333]">/</span>
            <span className="text-[#E50914]">Profile</span>
          </div>
          <button
            onClick={logout}
            className="border border-[#2A2A2A] hover:border-[#E50914] text-[#888] hover:text-[#E50914] text-[10px] font-black tracking-[0.2em] uppercase px-4 py-2 transition-colors duration-200"
          >
            Logout
          </button>
        </header>

        {/* Toast */}
        {toast && (
          <div className="fixed top-6 right-6 z-50 bg-[#052e16] border border-[#22c55e]/40 text-[#22c55e] text-[11px] font-black tracking-[0.2em] uppercase px-5 py-3 shadow-lg">
            {toast}
          </div>
        )}

        <main className="max-w-5xl mx-auto px-6 py-12">
          <p className="text-[#E50914] text-[10px] font-black tracking-[0.3em] uppercase mb-3">
            {user?.name ?? "Member"}
          </p>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mb-10">
            My Profile
          </h1>

          {loading ? (
            <div className="bg-[#111111] border border-[#2A2A2A] p-16 text-center">
              <p className="text-[#444] text-sm animate-pulse">
                Loading profile...
              </p>
            </div>
          ) : fetchError && !profile ? (
            <div className="bg-[#111111] border border-[#2A2A2A] p-8">
              <p className="text-[#E50914] text-sm">{fetchError}</p>
            </div>
          ) : profile ? (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Left: profile card */}
              <div className="lg:col-span-2">
                <ProfileCard
                  profile={profile}
                  onEditClick={() => setEditing(true)}
                  completionPercent={computeCompletion(profile)}
                />
              </div>

              {/* Right: details / edit form */}
              <div className="lg:col-span-3">
                <div className="bg-[#111111] border border-[#2A2A2A] p-6">
                  <p className="text-[#555] text-[10px] font-black tracking-[0.2em] uppercase mb-5">
                    {editing ? "Edit Details" : "Profile Details"}
                  </p>

                  {saveError && (
                    <div className="bg-[#E50914]/10 border border-[#E50914]/40 text-[#E50914] text-xs px-4 py-3 tracking-wide mb-5">
                      {saveError}
                    </div>
                  )}

                  {editing ? (
                    <EditProfileForm
                      profile={profile}
                      onSave={handleSave}
                      onCancel={() => {
                        setEditing(false);
                        setSaveError(null);
                      }}
                      loading={saving}
                    />
                  ) : (
                    <div>
                      <div className="space-y-0 mb-6">
                        {detailRows.map(({ label, value }) => (
                          <div
                            key={label}
                            className="flex items-center justify-between py-3 border-b border-[#1A1A1A] last:border-0"
                          >
                            <span className="text-[#555] text-[10px] font-black tracking-[0.2em] uppercase">
                              {label}
                            </span>
                            <span className="text-white text-sm font-medium text-right">
                              {value}
                            </span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => setEditing(true)}
                        className="w-full bg-[#E50914] hover:bg-[#C20812] text-white text-[10px] font-black tracking-[0.2em] uppercase py-3 transition-all duration-200"
                      >
                        Edit Profile
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}

          {/* Change Password */}
          <div className="mt-6 bg-[#111111] border border-[#2A2A2A]">
            <button
              onClick={() => setPwOpen((v) => !v)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#161616] transition-colors duration-200 group"
            >
              <p className="text-[#555] group-hover:text-[#888] text-[10px] font-black tracking-[0.2em] uppercase transition-colors duration-200">
                Change Password
              </p>
              <svg
                className={`w-4 h-4 text-[#555] group-hover:text-[#888] transition-all duration-200 ${
                  pwOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {pwOpen && (
              <div className="px-6 pb-6 pt-2 border-t border-[#1A1A1A]">
                <ChangePasswordForm
                  onSuccess={() => {
                    showToast("Password updated successfully!");
                    setPwOpen(false);
                  }}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
