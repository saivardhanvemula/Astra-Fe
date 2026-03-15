import type { Metadata } from "next";
import HeroSection from "@/components/HeroSection";
import PlanCard from "@/components/PlanCard";
import CTASection from "@/components/CTASection";
import type { Plan } from "@/types";

export const metadata: Metadata = {
  title: "Membership Plans",
  description:
    "Choose your Astra Gym membership. Monthly, Quarterly, and Yearly plans with flexible pricing and premium benefits.",
};

const plans: Plan[] = [
  {
    id: "monthly",
    name: "Monthly",
    price: 999,
    duration: "Monthly",
    features: [
      "Full gym access (all areas)",
      "2 personal training sessions",
      "Locker & shower access",
      "Group classes included",
      "Mobile app access",
      "Guest pass (x1 per month)",
    ],
  },
  {
    id: "quarterly",
    name: "Quarterly",
    price: 2499,
    duration: "3 Months",
    popular: true,
    features: [
      "Full gym access (all areas)",
      "6 personal training sessions",
      "Locker & shower access",
      "Group classes included",
      "Mobile app access",
      "Guest pass (x2 per month)",
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
      "Full gym access (all areas)",
      "24 personal training sessions",
      "Locker & shower access",
      "Group classes included",
      "Mobile app access",
      "Guest pass (x4 per month)",
      "Diet & nutrition consult",
      "Body composition analysis",
      "Priority class booking",
      "Free fitness assessment",
      "Freeze option (up to 1 month)",
    ],
  },
];

const addOns = [
  { name: "Extra PT Session", price: "₹350 / session" },
  { name: "Diet Plan (Monthly)", price: "₹499 / month" },
  { name: "Massage Therapy", price: "₹799 / session" },
  { name: "Supplement Pack", price: "₹1,299 / month" },
];

const faqs = [
  {
    q: "Can I freeze my membership?",
    a: "Yearly members can freeze their membership for up to 30 days per year. Quarterly and monthly plans are not eligible for freezing.",
  },
  {
    q: "Is there a joining fee?",
    a: "There is a one-time registration fee of ₹499 for all new members. This covers your welcome kit, body assessment, and onboarding session.",
  },
  {
    q: "Can I upgrade my plan mid-cycle?",
    a: "Absolutely. You can upgrade at any time — just pay the prorated difference. Downgrades take effect at the end of your current billing cycle.",
  },
  {
    q: "What happens if I miss sessions?",
    a: "Unused personal training sessions from monthly plans expire at month end. Quarterly and yearly session credits roll over for up to 30 days.",
  },
];

export default function PlansPage() {
  return (
    <>
      {/* Hero */}
      <HeroSection
        tagline="Membership"
        title="Invest in"
        titleHighlight="Yourself"
        subtitle="Pick the plan that fits your life. No hidden fees, no long-term lock-ins — just world-class training at a fair price."
        ctaText="Join Now"
        ctaHref="/join"
        fullScreen={false}
        showScroll={false}
      />

      {/* Plans */}
      <section id="plans" className="py-24 bg-[#0B0B0B]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-[#E50914] text-[11px] font-black tracking-[0.3em] uppercase mb-4">
              Choose Your Plan
            </p>
            <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white mb-4">
              Membership Plans
            </h2>
            <p className="text-[#666] text-lg max-w-xl mx-auto">
              All plans include full gym access. Prices listed are inclusive of
              all taxes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start mt-8">
            {plans.map((plan, i) => (
              <PlanCard key={plan.id} plan={plan} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Plan comparison note */}
      <section className="py-12 bg-[#111111]">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-[#555] text-sm leading-relaxed">
            All memberships include a one-time ₹499 registration fee. Payment
            accepted via UPI, credit/debit card, and net banking.{" "}
            <a
              href="/contact"
              className="text-[#E50914] hover:underline"
            >
              Contact us
            </a>{" "}
            for corporate or group rates.
          </p>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-24 bg-[#0B0B0B]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-[#E50914] text-[11px] font-black tracking-[0.3em] uppercase mb-4">
              Extras
            </p>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
              Add-On Services
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {addOns.map((a) => (
              <div
                key={a.name}
                className="bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#E50914]/50 p-6 transition-colors duration-200 text-center"
              >
                <p className="text-white font-black uppercase tracking-wide text-sm mb-2">
                  {a.name}
                </p>
                <p className="text-[#E50914] font-black text-lg">{a.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-[#111111]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-[#E50914] text-[11px] font-black tracking-[0.3em] uppercase mb-4">
              FAQs
            </p>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
              Common Questions
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="bg-[#1A1A1A] border border-[#2A2A2A] p-6"
              >
                <h4 className="text-white font-black uppercase tracking-wide text-sm mb-3 flex items-start gap-3">
                  <span className="text-[#E50914] flex-shrink-0">Q.</span>
                  {faq.q}
                </h4>
                <p className="text-[#777] text-sm leading-relaxed pl-5">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Pick Your Plan,"
        titleHighlight="Start Today"
        subtitle="The best time to join was yesterday. The second best time is right now."
        ctaText="Join Now"
        ctaHref="/join"
        variant="red"
      />
    </>
  );
}
