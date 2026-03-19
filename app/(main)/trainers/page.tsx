import type { Metadata } from "next";
import HeroSection from "@/components/HeroSection";
import CTASection from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Our Trainers",
  description:
    "Meet the elite certified trainers at Astra Gym. Experts in strength, bodybuilding, yoga, CrossFit, and more.",
};

export default function TrainersPage() {
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
