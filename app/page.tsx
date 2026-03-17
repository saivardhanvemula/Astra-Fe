import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import FeatureCard from "@/components/FeatureCard";
import PlansSection from "@/components/PlansSection";
import CTASection from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Astra – The Real Gym",
  description:
    "Forge your limits at Astra – The Real Gym. World-class trainers, premium equipment, and results-driven membership plans.",
};

const features = [
  {
    icon: "💪",
    title: "Expert Trainers",
    description:
      "Our certified coaches deliver personalised training plans tailored to your body, goals, and schedule so you hit results faster.",
  },
  {
    icon: "🏋️",
    title: "Premium Equipment",
    description:
      "Train with the latest Olympic barbells, cable systems, functional rigs, and cutting-edge cardio machines in a world-class setting.",
  },
  {
    icon: "⚡",
    title: "Proven Results",
    description:
      "Over 500 successful transformations and counting. Our science-backed methodology delivers measurable, lasting change.",
  },
];


const stats = [
  { value: "500+", label: "Active Members" },
  { value: "15+", label: "Expert Trainers" },
  { value: "200+", label: "Transformations" },
  { value: "5 ★", label: "Average Rating" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <HeroSection
        tagline="Astra – The Real Gym"
        title="Forge Your"
        titleHighlight="Limits"
        subtitle="Train harder. Push further. Become unstoppable. Join Astra Gym and unlock the best version of yourself with expert coaching and world-class facilities."
        ctaText="Start Your Journey"
        ctaHref="/join"
        secondaryCtaText="View Plans"
        secondaryCtaHref="/plans"
      />

      {/* Stats bar */}
      <section className="bg-[#E50914] py-8">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-black text-white">{s.value}</div>
              <div className="text-white/70 text-[10px] tracking-[0.25em] uppercase mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Astra */}
      <section className="py-24 bg-[#0B0B0B]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-[#E50914] text-[11px] font-black tracking-[0.3em] uppercase mb-4">
              Why Choose Us
            </p>
            <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white">
              Why Astra Gym?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <FeatureCard key={f.title} {...f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Membership Plans Preview */}
      <section className="py-24 bg-[#111111]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-[#E50914] text-[11px] font-black tracking-[0.3em] uppercase mb-4">
              Membership
            </p>
            <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white mb-4">
              Choose Your Plan
            </h2>
            <p className="text-[#666] text-lg max-w-xl mx-auto">
              Flexible plans designed to fit every lifestyle and fitness level.
            </p>
          </div>
          <PlansSection />
          <div className="text-center mt-12">
            <Link
              href="/plans"
              className="inline-block border border-[#E50914] text-[#E50914] hover:bg-[#E50914] hover:text-white px-10 py-3 font-black tracking-widest uppercase text-sm transition-all duration-200"
            >
              View All Plans
            </Link>
          </div>
        </div>
      </section>

      {/* Trainers temporarily hidden */}

      {/* Transformations temporarily hidden */}

      {/* CTA */}
      <CTASection
        title="Ready to"
        titleHighlight="Transform?"
        subtitle="Don't wait for Monday. Don't wait for a new year. Start today — your strongest self is waiting."
        ctaText="Join Astra Today"
        ctaHref="/join"
      />
    </>
  );
}

