import type { Metadata } from "next";
import HeroSection from "@/components/HeroSection";
import TransformationCard from "@/components/TransformationCard";
import CTASection from "@/components/CTASection";
import type { Transformation } from "@/types";

export const metadata: Metadata = {
  title: "Transformations",
  description:
    "Real before-and-after fitness transformations from Astra Gym members. Real results from real people.",
};

const transformations: Transformation[] = [
  {
    id: "1",
    memberName: "Amit Patel",
    description:
      "Shed 25 kg of body fat while building significant lean muscle through a structured strength + HIIT programme. Amit transformed in 6 months with 4 sessions per week.",
    duration: "6 Months",
    weightLost: "25 kg",
  },
  {
    id: "2",
    memberName: "Sunita Rao",
    description:
      "Went from completely sedentary to competing in a regional physique show in just four months of dedicated training and dieting.",
    duration: "4 Months",
  },
  {
    id: "3",
    memberName: "Karan Malhotra",
    description:
      "Dropped 15 kg and completely reversed pre-diabetic markers by training 5 days per week with a coach-designed nutrition plan.",
    duration: "3 Months",
    weightLost: "15 kg",
  },
  {
    id: "4",
    memberName: "Meena Reddy",
    description:
      "Post-pregnancy comeback — Meena rebuilt her core, lost 18 kg, and found a newfound confidence and energy through women-specific training.",
    duration: "8 Months",
    weightLost: "18 kg",
  },
  {
    id: "5",
    memberName: "Arjun Nair",
    description:
      "Skinny to strong — Arjun gained 12 kg of lean muscle mass with progressive overload training and a calorie-surplus diet plan.",
    duration: "10 Months",
  },
  {
    id: "6",
    memberName: "Pooja Krishnan",
    description:
      "Overcame chronic back pain through corrective exercise and mobility work, then went on to complete her first 10K run at age 45.",
    duration: "5 Months",
  },
  {
    id: "7",
    memberName: "Rahul Mehta",
    description:
      "Former college athlete who returned to fitness after a 10-year gap. Recovered sports physique and surpassed his college-era benchmarks.",
    duration: "7 Months",
    weightLost: "10 kg",
  },
  {
    id: "8",
    memberName: "Deepa Varma",
    description:
      "Transformed body composition from 34% to 21% body fat through a combination of resistance training and personalised nutrition.",
    duration: "9 Months",
  },
  {
    id: "9",
    memberName: "Sanjay Gopal",
    description:
      "Lost 30 kg over one year — the most dramatic transformation in Astra history. Sanjay now trains recreationally and mentors new members.",
    duration: "12 Months",
    weightLost: "30 kg",
  },
];

const stats = [
  { value: "200+", label: "Transformations" },
  { value: "90%", label: "Success Rate" },
  { value: "500+", label: "kg Lost Collectively" },
  { value: "4.9★", label: "Member Rating" },
];

export default function TransformationsPage() {
  return (
    <>
      {/* Hero */}
      <HeroSection
        tagline="Real Results"
        title="The Proof is"
        titleHighlight="Here"
        subtitle="No filters, no tricks. Just real people who committed to the process and achieved life-changing results at Astra Gym."
        ctaText="Start Your Transformation"
        ctaHref="/join"
        fullScreen={false}
        showScroll={false}
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

      {/* Gallery */}
      <section className="py-24 bg-[#0B0B0B]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-[#E50914] text-[11px] font-black tracking-[0.3em] uppercase mb-4">
              Before & After
            </p>
            <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white mb-4">
              Member Transformations
            </h2>
            <p className="text-[#666] text-lg max-w-xl mx-auto">
              Each card tells a story of consistency, sacrifice, and the will to
              change.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {transformations.map((t, i) => (
              <TransformationCard key={t.id} transformation={t} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-10 bg-[#111111]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-[#444] text-xs leading-relaxed">
            Individual results vary based on dedication, adherence to
            programme, diet, and personal physiology. All transformations shown
            are real Astra Gym members. Photos used with permission.
          </p>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Your Turn to"
        titleHighlight="Transform"
        subtitle="Every single person in this gallery was once where you are right now. The only difference? They started."
        ctaText="Join Astra Today"
        ctaHref="/join"
        variant="red"
      />
    </>
  );
}
