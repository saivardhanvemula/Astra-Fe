import type { Metadata } from "next";
import CTASection from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Astra Gym. Find our address, phone number, gym timings, and contact us via WhatsApp.",
};

const timings = [
  { day: "Monday – Friday", hours: "5:00 AM – 11:00 PM" },
  { day: "Saturday", hours: "5:00 AM – 10:00 PM" },
  { day: "Sunday", hours: "6:00 AM – 9:00 PM" },
  { day: "Public Holidays", hours: "7:00 AM – 8:00 PM" },
];

const contactCards = [
  {
    icon: "📍",
    label: "Address",
    value: "123 Fitness Avenue, Gym District, City – 400 001",
    link: null,
  },
  {
    icon: "📞",
    label: "Phone",
    value: "+91 98765 43210",
    link: "tel:+919876543210",
  },
  {
    icon: "✉️",
    label: "Email",
    value: "info@astragym.in",
    link: "mailto:info@astragym.in",
  },
  {
    icon: "💬",
    label: "WhatsApp",
    value: "Chat with us instantly",
    link: "https://wa.me/919876543210",
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Page header */}
      <section className="pt-32 pb-16 bg-[#0B0B0B] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full bg-[#E50914]/5 blur-[100px] pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-8 bg-[#E50914]" />
            <span className="text-[#E50914] text-[11px] font-black tracking-[0.35em] uppercase">
              Get In Touch
            </span>
            <span className="h-px w-8 bg-[#E50914]" />
          </div>
          <h1 className="text-5xl sm:text-6xl font-black uppercase tracking-tight text-white mb-5">
            Contact <span className="text-[#E50914]">Us</span>
          </h1>
          <p className="text-[#888] text-lg max-w-xl mx-auto">
            We&apos;d love to hear from you. Visit us, call us, or drop a
            message — our team is always here to help.
          </p>
        </div>
      </section>

      {/* Contact cards */}
      <section className="pb-16 bg-[#0B0B0B]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactCards.map((card) => (
              <div
                key={card.label}
                className="bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#E50914]/50 p-6 transition-colors duration-200"
              >
                <span className="text-3xl block mb-4">{card.icon}</span>
                <p className="text-[#555] text-[10px] font-black tracking-[0.2em] uppercase mb-2">
                  {card.label}
                </p>
                {card.link ? (
                  <a
                    href={card.link}
                    target={card.link.startsWith("https") ? "_blank" : undefined}
                    rel={
                      card.link.startsWith("https")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="text-white font-semibold text-sm hover:text-[#E50914] transition-colors duration-200 break-words"
                  >
                    {card.value}
                  </a>
                ) : (
                  <p className="text-white font-semibold text-sm break-words">
                    {card.value}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map + Timings */}
      <section className="py-16 bg-[#111111]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Google Maps embed */}
            <div className="lg:col-span-3">
              <h2 className="text-white font-black uppercase tracking-wide text-sm mb-5 flex items-center gap-3">
                <span className="w-5 h-0.5 bg-[#E50914]" />
                Find Us
              </h2>
              <div className="border border-[#2A2A2A] overflow-hidden">
                <iframe
                  title="Astra Gym Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241316.6424478168!2d72.71637249999999!3d19.082197599999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
                  width="100%"
                  height="380"
                  style={{ border: 0, display: "block" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Timings */}
            <div className="lg:col-span-2">
              <h2 className="text-white font-black uppercase tracking-wide text-sm mb-5 flex items-center gap-3">
                <span className="w-5 h-0.5 bg-[#E50914]" />
                Gym Timings
              </h2>
              <div className="space-y-3">
                {timings.map((t) => (
                  <div
                    key={t.day}
                    className="bg-[#1A1A1A] border border-[#2A2A2A] px-5 py-4 flex items-center justify-between"
                  >
                    <span className="text-[#888] text-sm font-medium">
                      {t.day}
                    </span>
                    <span className="text-[#E50914] text-sm font-black">
                      {t.hours}
                    </span>
                  </div>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#22C55E] text-white py-4 font-black tracking-widest uppercase text-sm transition-all duration-200 hover:scale-105"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 fill-current"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Ready to"
        titleHighlight="Begin?"
        subtitle="Stop thinking, start doing. Join Astra Gym today and take the first step towards the strongest version of yourself."
        ctaText="Register Now"
        ctaHref="/join"
      />
    </>
  );
}
