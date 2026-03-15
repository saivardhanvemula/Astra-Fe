import type { Metadata } from "next";
import { Suspense } from "react";
import JoinForm from "@/components/JoinForm";

export const metadata: Metadata = {
  title: "Join Astra Gym",
  description:
    "Register for your Astra Gym membership today. Choose your plan and start your fitness journey with us.",
};

const benefits = [
  "Access to all gym areas & equipment",
  "Expert certified trainers on duty",
  "Group classes every day",
  "Progress tracking & coaching",
  "Clean, premium locker rooms",
  "Nutrition bar & supplement store",
];

function JoinFormFallback() {
  return (
    <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-10 flex items-center justify-center min-h-[400px]">
      <div className="w-8 h-8 border-2 border-[#2A2A2A] border-t-[#E50914] rounded-full animate-spin" />
    </div>
  );
}

export default function JoinPage() {
  return (
    <>
      {/* Page header */}
      <section className="pt-32 pb-16 bg-[#0B0B0B] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full bg-[#E50914]/5 blur-[100px] pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-8 bg-[#E50914]" />
            <span className="text-[#E50914] text-[11px] font-black tracking-[0.35em] uppercase">
              Registration
            </span>
            <span className="h-px w-8 bg-[#E50914]" />
          </div>
          <h1 className="text-5xl sm:text-6xl font-black uppercase tracking-tight text-white mb-5">
            Join <span className="text-[#E50914]">Astra</span> Gym
          </h1>
          <p className="text-[#888] text-lg max-w-xl mx-auto">
            Fill out the form below and our team will reach out within 24 hours
            to confirm your membership and schedule your first session.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="pb-24 bg-[#0B0B0B]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Form — 3/5 width */}
            <div className="lg:col-span-3">
              <Suspense fallback={<JoinFormFallback />}>
                <JoinForm />
              </Suspense>
            </div>

            {/* Side info — 2/5 width */}
            <div className="lg:col-span-2 space-y-6">
              {/* What you get */}
              <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-7">
                <h3 className="text-white font-black uppercase tracking-wide text-sm mb-5 flex items-center gap-3">
                  <span className="w-5 h-0.5 bg-[#E50914]" />
                  What You Get
                </h3>
                <ul className="space-y-3">
                  {benefits.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-sm text-[#bbb]">
                      <span className="text-[#E50914] font-black flex-shrink-0 mt-0.5">
                        ✓
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Plans quick reference */}
              <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-7">
                <h3 className="text-white font-black uppercase tracking-wide text-sm mb-5 flex items-center gap-3">
                  <span className="w-5 h-0.5 bg-[#E50914]" />
                  Plan Pricing
                </h3>
                <div className="space-y-3">
                  {[
                    { name: "Monthly", price: "₹999", duration: "/ month" },
                    {
                      name: "Quarterly",
                      price: "₹2,499",
                      duration: "/ 3 months",
                      popular: true,
                    },
                    { name: "Yearly", price: "₹7,999", duration: "/ year" },
                  ].map((p) => (
                    <div
                      key={p.name}
                      className={`flex items-center justify-between py-2 border-b border-[#2A2A2A] last:border-0 ${
                        p.popular ? "text-[#E50914]" : ""
                      }`}
                    >
                      <div>
                        <span
                          className={`text-sm font-black uppercase tracking-wide ${
                            p.popular ? "text-[#E50914]" : "text-white"
                          }`}
                        >
                          {p.name}
                        </span>
                        {p.popular && (
                          <span className="ml-2 text-[9px] bg-[#E50914] text-white px-2 py-0.5 font-black uppercase tracking-wider">
                            Popular
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span
                          className={`font-black text-base ${
                            p.popular ? "text-[#E50914]" : "text-white"
                          }`}
                        >
                          {p.price}
                        </span>
                        <span className="text-[#555] text-xs ml-1">
                          {p.duration}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact nudge */}
              <div className="bg-[#E50914]/10 border border-[#E50914]/30 p-6">
                <p className="text-[#E50914] text-sm font-black uppercase tracking-wide mb-2">
                  💬 Need Help?
                </p>
                <p className="text-[#bbb] text-sm mb-4">
                  Our team is available 6 AM – 10 PM to answer any questions.
                </p>
                <a
                  href="tel:+919876543210"
                  className="block text-center bg-[#E50914] hover:bg-[#C20812] text-white py-2.5 font-black tracking-widest uppercase text-xs transition-all duration-200"
                >
                  Call Us Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
