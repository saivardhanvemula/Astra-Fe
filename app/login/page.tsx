import type { Metadata } from "next";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-10">
          <p className="text-[#E50914] text-[10px] font-black tracking-[0.35em] uppercase mb-2">
            The Real Gym
          </p>
          <h1 className="text-5xl font-black uppercase tracking-tight text-white">
            Astra
          </h1>
          <p className="text-[#555] text-sm mt-3 tracking-wide">
            Sign in to your account
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#111111] border border-[#2A2A2A] p-8">
          <LoginForm />
        </div>

        <p className="text-center text-[#333] text-xs mt-6 tracking-widest uppercase">
          &copy; {new Date().getFullYear()} Astra Gym. All rights reserved.
        </p>
      </div>
    </div>
  );
}
