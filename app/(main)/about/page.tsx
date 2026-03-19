import type { Metadata } from "next";
import HeroSection from "@/components/HeroSection";
import FeatureCard from "@/components/FeatureCard";
import CTASection from "@/components/CTASection";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Astra Gym's story, mission, vision, world-class facilities, and premium equipment.",
};

const facilities = [
  {
    icon: "🏋️",
    title: "Olympic Lifting Platform",
    description:
      "Dedicated Olympic weightlifting area with 6 regulation platforms, bumper plates, and competition bars.",
  },
  {
    icon: "🔴",
    title: "Cardio Zone",
    description:
      "50+ cardio machines including treadmills, assault bikes, rowers, stair-climbers, and ellipticals.",
  },
  {
    icon: "⚙️",
    title: "Functional Training Rig",
    description:
      "Full-size functional rig with monkey bars, battle ropes, sled tracks, and wall-ball targets.",
  },
  {
    icon: "🧘",
    title: "Yoga & Stretch Studio",
    description:
      "Dedicated studio for yoga, Pilates, and stretching sessions — open daily with instructor-led classes.",
  },
  {
    icon: "🚿",
    title: "Premium Locker Rooms",
    description:
      "Spacious locker rooms with secure storage, showers, steam rooms, and premium toiletries.",
  },
  {
    icon: "🥤",
    title: "Nutrition Bar",
    description:
      "In-gym smoothie and nutrition bar serving custom protein shakes, meal-prep packs, and supplements.",
  },
];

const equipment = [
  { name: "Barbells & Olympic Sets", qty: "20+" },
  { name: "Dumbbells (2.5 – 60 kg)", qty: "Full Set" },
  { name: "Cable & Pulley Machines", qty: "12 Stations" },
  { name: "Plate-Loaded Machines", qty: "18 Machines" },
  { name: "Cardio Machines", qty: "55+" },
  { name: "Power Racks / Squat Racks", qty: "8 Racks" },
  { name: "Smith Machines", qty: "4 Machines" },
  { name: "Kettlebells (4 – 48 kg)", qty: "Full Range" },
];

const milestones = [
  { year: "2015", event: "Astra Gym founded with a single hall and 12 members." },
  {
    year: "2017",
    event: "Expanded to 8,000 sq ft; launched personal training programme.",
  },
  {
    year: "2019",
    event: "Crossed 300 members; opened dedicated yoga and functional studio.",
  },
  {
    year: "2022",
    event: "Full renovation — added Olympic platform, premium locker rooms, and nutrition bar.",
  },
  {
    year: "2024",
    event: "500+ active members, 15 certified coaches, rated #1 gym in the city.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <HeroSection
        tagline="Our Story"
        title="Built for the"
        titleHighlight="Relentless"
        subtitle="Astra Gym was built with one purpose — to create a space where ordinary people do extraordinary things."
        ctaText="Join the Community"
        ctaHref="/join"
        secondaryCtaText="View Plans"
        secondaryCtaHref="/plans"
        fullScreen={false}
        showScroll={false}
      />

      {/* Story */}
      <section className="py-24 bg-[#0B0B0B]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#E50914] text-[11px] font-black tracking-[0.3em] uppercase mb-4">
                The Astra Story
              </p>
              <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white mb-6 leading-tight">
                From a Single Hall to a City Institution
              </h2>
              <p className="text-[#888] leading-relaxed mb-4">
                Astra Gym was born in 2015 from a simple but powerful belief —
                that every person deserves access to a world-class training
                environment regardless of their fitness background. What started
                as a single hall with 12 passionate members has grown into the
                city&apos;s most respected fitness community.
              </p>
              <p className="text-[#888] leading-relaxed mb-4">
                Our founder, a former national athlete, poured two decades of
                training knowledge into designing a gym that prioritises
                performance, safety, and community. Every square foot of Astra
                was built with intention.
              </p>
              <p className="text-[#888] leading-relaxed">
                Today, with 500+ members, 15 elite trainers, and an unbroken
                record of transformation success stories, Astra stands as proof
                that the right environment transforms lives.
              </p>
            </div>

            {/* Timeline */}
            <div className="space-y-0">
              {milestones.map((m, i) => (
                <div key={m.year} className="flex gap-6 group">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-[#E50914] mt-1 flex-shrink-0 group-first:mt-0" />
                    {i < milestones.length - 1 && (
                      <div className="w-px flex-1 bg-[#2A2A2A] mt-1" />
                    )}
                  </div>
                  <div className="pb-8">
                    <span className="text-[#E50914] text-[11px] font-black tracking-widest uppercase">
                      {m.year}
                    </span>
                    <p className="text-[#bbb] text-sm leading-relaxed mt-1">
                      {m.event}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-[#111111]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-[#1A1A1A] border-l-4 border-[#E50914] p-10">
              <p className="text-[#E50914] text-[11px] font-black tracking-[0.3em] uppercase mb-4">
                Our Mission
              </p>
              <h3 className="text-3xl font-black uppercase tracking-tight text-white mb-5">
                Empower Every Rep
              </h3>
              <p className="text-[#888] leading-relaxed">
                To provide an inclusive, high-performance training environment
                that empowers every individual — beginner or advanced — to
                achieve their personal best through expert coaching, premium
                facilities, and an unwavering culture of discipline.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-[#E50914] p-10">
              <p className="text-white/60 text-[11px] font-black tracking-[0.3em] uppercase mb-4">
                Our Vision
              </p>
              <h3 className="text-3xl font-black uppercase tracking-tight text-white mb-5">
                A Fitter City
              </h3>
              <p className="text-white/80 leading-relaxed">
                To become the catalyst for a healthier, more active city by
                nurturing a community where fitness is a lifestyle, not a
                resolution — and where every single member realises that their
                strongest self is always one hard workout away.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-24 bg-[#0B0B0B]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-[#E50914] text-[11px] font-black tracking-[0.3em] uppercase mb-4">
              Facilities
            </p>
            <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white">
              World-Class Infrastructure
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((f, i) => (
              <FeatureCard key={f.title} {...f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Equipment Showcase */}
      <section className="py-24 bg-[#111111]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-[#E50914] text-[11px] font-black tracking-[0.3em] uppercase mb-4">
              Equipment
            </p>
            <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white">
              Premium Gear
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {equipment.map((eq) => (
              <div
                key={eq.name}
                className="bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#E50914]/50 p-6 transition-colors duration-200 group"
              >
                <div className="text-[#E50914] font-black text-lg mb-1 group-hover:scale-105 transition-transform duration-200">
                  {eq.qty}
                </div>
                <div className="text-white font-semibold text-sm">{eq.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Start Your"
        titleHighlight="Journey"
        subtitle="Everything you need to transform your body is right here. All you need to bring is the commitment."
        ctaText="Join Astra Today"
        ctaHref="/join"
      />
    </>
  );
}
