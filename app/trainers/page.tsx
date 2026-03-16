import type { Metadata } from "next";
import HeroSection from "@/components/HeroSection";
import TrainerCard from "@/components/TrainerCard";
import CTASection from "@/components/CTASection";
import { getTrainers } from "@/services/trainerService";

export const metadata: Metadata = {
  title: "Our Trainers",
  description:
    "Meet the elite certified trainers at Astra Gym. Experts in strength, bodybuilding, yoga, CrossFit, and more.",
};

const specializations = [
  "Strength & Powerlifting",
  "Bodybuilding & Physique",
  "CrossFit & Functional",
  "Yoga & Wellness",
  "Weight Loss",
  "Women's Fitness",
  "Sports Performance",
  "Nutrition Coaching",
];

export default async function TrainersPage() {
  let trainers;
  try {
    trainers = await getTrainers();
  } catch {
    trainers = null;
  }

  // Derive unique specialization tags from live data (fallback to static list)
  const specializations =
    trainers && trainers.length > 0
      ? [...new Set(trainers.map((t) => t.specialization))]
      : [
          "Strength & Powerlifting",
          "Bodybuilding & Physique",
          "CrossFit & Functional",
          "Yoga & Wellness",
          "Weight Loss",
          "Women's Fitness",
          "Sports Performance",
          "Nutrition Coaching",
        ];

  return (
    <>
      {/* Hero */}
      <HeroSection
        tagline="Expert Coaching"
        title="Meet the"
        titleHighlight="Team"
        subtitle="Our certified coaches bring decades of collective experience to help you train smarter, avoid injury, and hit results faster than you thought possible."
        ctaText="Train With Us"
        ctaHref="/join"
        fullScreen={false}
        showScroll={false}
      />

      {/* Specialization tags */}
      <section className="py-10 bg-[#111111] border-y border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {specializations.map((s) => (
              <span
                key={s}
                className="bg-[#1A1A1A] border border-[#2A2A2A] text-[#888] text-[10px] font-black tracking-[0.15em] uppercase px-4 py-2"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Trainer Grid */}
      <section className="py-24 bg-[#0B0B0B]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-[#E50914] text-[11px] font-black tracking-[0.3em] uppercase mb-4">
              Our Coaches
            </p>
            <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white">
              Expert Trainers
            </h2>
          </div>
          {trainers && trainers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {trainers.map((trainer, i) => (
                <TrainerCard key={trainer.id} trainer={trainer} index={i} />
              ))}
            </div>
          ) : trainers === null ? (
            <p className="text-center text-[#555] text-sm py-8">
              Unable to load trainers. Please try again later.
            </p>
          ) : (
            <p className="text-center text-[#555] text-sm py-8">
              No trainers available at the moment.
            </p>
          )}
        </div>
      </section>

      {/* Become a trainer */}
      <section className="py-16 bg-[#111111]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-[#E50914] text-[11px] font-black tracking-[0.3em] uppercase mb-4">
            Join Our Team
          </p>
          <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mb-4">
            Are You a Certified Trainer?
          </h3>
          <p className="text-[#666] mb-8 leading-relaxed">
            Astra Gym is always looking for passionate, certified fitness
            professionals to join our team. We offer competitive pay, flexible
            schedules, and a supportive community.
          </p>
          <a
            href="mailto:careers@astragym.in"
            className="inline-block bg-[#E50914] hover:bg-[#C20812] text-white px-10 py-3 font-black tracking-widest uppercase text-sm transition-all duration-200 hover:scale-105"
          >
            Apply Now
          </a>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Train Under"
        titleHighlight="The Best"
        subtitle="Book a free introductory session with one of our coaches and experience the Astra difference first-hand."
        ctaText="Book Free Session"
        ctaHref="/join"
      />
    </>
  );
}
