import Link from "next/link";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/plans", label: "Membership Plans" },
  { href: "/trainers", label: "Our Trainers" },
  { href: "/transformations", label: "Transformations" },
  { href: "/contact", label: "Contact" },
];

const planLinks = [
  { href: "/plans#monthly", label: "Monthly Plan" },
  { href: "/plans#quarterly", label: "Quarterly Plan" },
  { href: "/plans#yearly", label: "Yearly Plan" },
  { href: "/join", label: "Join Now" },
];

export default function Footer() {
  return (
    <footer className="bg-[#111111] border-t border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="block mb-2">
              <span className="text-3xl font-black tracking-widest uppercase text-white">
                AST<span className="text-[#E50914]">RA</span>
              </span>
            </Link>
            <p className="text-[9px] tracking-[0.25em] text-[#555] uppercase mb-5">
              The Real Gym
            </p>
            <p className="text-[#666] text-sm leading-relaxed mb-6">
              Your journey to the best version of yourself starts here. Train
              hard, stay dedicated, achieve greatness.
            </p>
            <div className="flex gap-2">
              {(
                [
                  { label: "FB", href: "#" },
                  { label: "IG", href: "#" },
                  { label: "YT", href: "#" },
                  { label: "TW", href: "#" },
                ] as const
              ).map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 flex items-center justify-center bg-[#2A2A2A] hover:bg-[#E50914] text-white text-[10px] font-black tracking-wider transition-colors duration-200"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-black tracking-[0.25em] uppercase text-[11px] mb-6 flex items-center gap-3">
              <span className="w-5 h-0.5 bg-[#E50914] inline-block flex-shrink-0" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[#666] hover:text-[#E50914] text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Plans */}
          <div>
            <h3 className="text-white font-black tracking-[0.25em] uppercase text-[11px] mb-6 flex items-center gap-3">
              <span className="w-5 h-0.5 bg-[#E50914] inline-block flex-shrink-0" />
              Membership
            </h3>
            <ul className="space-y-3">
              {planLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[#666] hover:text-[#E50914] text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-black tracking-[0.25em] uppercase text-[11px] mb-6 flex items-center gap-3">
              <span className="w-5 h-0.5 bg-[#E50914] inline-block flex-shrink-0" />
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-[#666]">
                <span className="text-[#E50914] text-base leading-none mt-0.5 flex-shrink-0">
                  ⊕
                </span>
                <span className="text-sm leading-relaxed">
                  123 Fitness Avenue, Gym District, City – 400 001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#E50914] text-base flex-shrink-0">
                  ☎
                </span>
                <a
                  href="tel:+919876543210"
                  className="text-[#666] hover:text-white text-sm transition-colors"
                >
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#E50914] text-base flex-shrink-0">
                  @
                </span>
                <a
                  href="mailto:info@astragym.in"
                  className="text-[#666] hover:text-white text-sm transition-colors"
                >
                  info@astragym.in
                </a>
              </li>
              <li className="flex items-start gap-3 text-[#666]">
                <span className="text-[#E50914] text-base flex-shrink-0">
                  ◷
                </span>
                <div className="text-sm leading-relaxed">
                  <p>Mon – Sat: 5:00 AM – 11:00 PM</p>
                  <p>Sunday: 6:00 AM – 9:00 PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-[#2A2A2A] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#444] text-xs">
            © {new Date().getFullYear()} Astra – The Real Gym. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-[#444] hover:text-[#666] text-xs transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-[#444] hover:text-[#666] text-xs transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
