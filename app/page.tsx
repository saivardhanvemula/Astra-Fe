import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import FeatureCard from "@/components/FeatureCard";
import PlanCard from "@/components/PlanCard";
import TrainerCard from "@/components/TrainerCard";
import TransformationCard from "@/components/TransformationCard";
import CTASection from "@/components/CTASection";
import type { Plan, Trainer, Transformation } from "@/types";

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

const plans: Plan[] = [
  {
    id: "monthly",
    name: "Monthly",
    price: 999,
    duration: "Monthly",
    features: [
      "Full gym access",
      "2 personal training sessions",
      "Locker & shower access",
      "Group classes included",
    ],
  },
  {
    id: "quarterly",
    name: "Quarterly",
    price: 2499,
    duration: "3 Months",
    popular: true,
    features: [
      "Full gym access",
      "6 personal training sessions",
      "Locker & shower access",
      "Group classes included",
      "Diet & nutrition consult",
      "Body composition analysis",
    ],
  },
  {
    id: "yearly",
    name: "Yearly",
    price: 7999,
    duration: "Annual",
    features: [
      "Full gym access",
      "24 personal training sessions",
      "Locker & shower access",
      "Group classes included",
      "Diet & nutrition consult",
      "Body composition analysis",
      "Priority booking",
      "Guest passes (x4)",
    ],
  },
];

const featuredTrainers: Trainer[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    specialization: "Strength & Powerlifting",
    experience: "8 Years",
    bio: "National-level powerlifter and certified strength coach. Rajesh has transformed over 200 athletes and everyday gym-goers with progressive overload programming.",
  },
  {
    id: "2",
    name: "Priya Sharma",
    specialization: "Yoga & Wellness",
    experience: "6 Years",
    bio: "Certified yoga instructor and wellness coach. Priya blends mobility, mindfulness, and functional movement to help clients achieve holistic health.",
  },
  {
    id: "3",
    name: "Vikram Singh",
    specialization: "Bodybuilding & Physique",
    experience: "10 Years",
    bio: "IFBB-conditioned physique competitor and transformation specialist. Vikram crafts precise nutrition and training plans to sculpt competition-ready bodies.",
  },
];

const featuredTransformations: Transformation[] = [
  {
    id: "1",
    memberName: "Amit Patel",
    description:
      "Shed 25 kg of fat while building lean muscle with a tailored strength + cardio programme.",
    duration: "6 Months",
    weightLost: "25 kg",
  },
  {
    id: "2",
    memberName: "Sunita Rao",
    description:
      "Went from sedentary to stage-ready physique competitor in just four months of dedicated training.",
    duration: "4 Months",
  },
  {
    id: "3",
    memberName: "Karan Malhotra",
    description:
      "Dropped 15 kg and reversed pre-diabetic markers through consistent training and nutrition coaching.",
    duration: "3 Months",
    weightLost: "15 kg",
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {plans.map((plan, i) => (
              <PlanCard key={plan.id} plan={plan} index={i} />
            ))}
          </div>
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

      {/* Trainers Preview */}
      <section className="py-24 bg-[#0B0B0B]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-[#E50914] text-[11px] font-black tracking-[0.3em] uppercase mb-4">
              Meet The Team
            </p>
            <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white mb-4">
              Expert Trainers
            </h2>
            <p className="text-[#666] text-lg max-w-xl mx-auto">
              Our certified coaches are dedicated to helping you reach your
              peak.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTrainers.map((trainer, i) => (
              <TrainerCard key={trainer.id} trainer={trainer} index={i} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/trainers"
              className="inline-block border border-[#E50914] text-[#E50914] hover:bg-[#E50914] hover:text-white px-10 py-3 font-black tracking-widest uppercase text-sm transition-all duration-200"
            >
              Meet All Trainers
            </Link>
          </div>
        </div>
      </section>

      {/* Transformations Preview */}
      <section className="py-24 bg-[#111111]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-[#E50914] text-[11px] font-black tracking-[0.3em] uppercase mb-4">
              Real Results
            </p>
            <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white mb-4">
              Transformations
            </h2>
            <p className="text-[#666] text-lg max-w-xl mx-auto">
              Real people. Real dedication. Real results.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTransformations.map((t, i) => (
              <TransformationCard key={t.id} transformation={t} index={i} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/transformations"
              className="inline-block border border-[#E50914] text-[#E50914] hover:bg-[#E50914] hover:text-white px-10 py-3 font-black tracking-widest uppercase text-sm transition-all duration-200"
            >
              View All Transformations
            </Link>
          </div>
        </div>
      </section>

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

