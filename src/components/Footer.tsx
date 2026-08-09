import Image from "next/image";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Team", href: "#team" },
  { label: "Projects", href: "#projects" },
  { label: "Events", href: "#events" },
  { label: "Contact", href: "#contact" },
];

const SOCIALS = [
  {
    label: "GitHub",
    href: "https://github.com/djs-codeai",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/djs-codeai",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com/djs_codeai",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
];

// +91 8104665118 → 918104665118 (E.164 without +) for wa.me
const WHATSAPP_URL =
  "https://wa.me/918104665118?text=Hi%20DJS%20CodeAI!%20I%20saw%20your%20site.";
const CONTACT_EMAIL = "contact.djscodeai@gmail.com";

export default function Footer() {
  return (
    <footer className="relative">
      {/* ─── CTA block ─── */}
      <section className="px-6 pt-12 md:pt-16 pb-12 md:pb-16 text-center">
        <p
          className="label-caps mb-8 md:mb-10 tracking-[0.3em]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Have an idea?
        </p>

        <h2 className="display-heading chrome-text-animated text-6xl sm:text-7xl md:text-9xl lg:text-[11rem] leading-[0.9] tracking-tight mb-10 md:mb-14">
          let&apos;s build.
        </h2>

        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="inline-block text-chrome-mid text-sm md:text-base pb-1 border-b border-chrome-lo hover:text-chrome-hi hover:border-chrome-mid transition-colors duration-300"
        >
          {CONTACT_EMAIL}
        </a>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-chrome-hi text-obsidian text-sm font-semibold tracking-wider uppercase shadow-[0_0_40px_rgba(246,247,251,0.15)] hover:shadow-[0_0_50px_rgba(246,247,251,0.3)] hover:scale-[1.02] transition-all duration-300"
          >
            Say Hello
            <svg
              className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H8M17 7v9" />
            </svg>
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full border border-chrome-lo text-chrome-hi text-sm font-semibold tracking-wider uppercase hover:border-chrome-mid hover:bg-obsidian-2 transition-all duration-300"
          >
            WhatsApp
            <svg
              className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H8M17 7v9" />
            </svg>
          </a>
        </div>
      </section>

      {/* ─── Main footer grid ─── */}
      <div className="px-6 pt-12 md:pt-16 pb-8">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_1.3fr] gap-16 lg:gap-12 items-start">
          {/* Left — giant wordmark + tagline + socials */}
          <div>
            <div className="mb-8 inline-block -ml-6 md:-ml-10">
              <Image
                src="/7.png"
                alt="DJS CodeAI"
                width={520}
                height={200}
                className="object-contain"
                style={{ aspectRatio: "156/60", filter: "brightness(1.15) contrast(1.05)" }}
              />
            </div>
            <p className="text-muted text-sm md:text-base max-w-sm leading-relaxed mb-8">
              DJS CodeAI builds more than models.
              <br />
              We build the community behind them.
            </p>
            <div className="flex gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-11 h-11 rounded-full border border-glass-border bg-obsidian-2 text-muted flex items-center justify-center hover:text-chrome-hi hover:border-chrome-lo hover:bg-obsidian-3 transition-all duration-300"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Middle — Explore */}
          <div>
            <p
              className="label-caps mb-6 text-chrome-mid tracking-[0.25em]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Explore
            </p>
            <ul className="space-y-3">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-chrome-mid text-sm hover:text-chrome-hi transition-colors duration-300"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — Contact */}
          <div>
            <p
              className="label-caps mb-6 text-chrome-mid tracking-[0.25em]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Contact
            </p>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-chrome-mid hover:text-chrome-hi transition-colors break-all"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <a
                  href="tel:+918104665118"
                  className="text-chrome-mid hover:text-chrome-hi transition-colors"
                >
                  <span className="text-muted">Phone: </span>+91 8104665118
                </a>
              </li>
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-chrome-mid hover:text-chrome-hi transition-colors"
                >
                  <span className="text-muted">WhatsApp: </span>+91 8104665118
                </a>
              </li>
              <li className="text-chrome-mid pt-2 leading-relaxed">
                <span className="text-muted">Location: </span>DJ Sanghvi College
                of Engineering, Vile Parle West, Mumbai
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-auto max-w-7xl mt-16">
          <div className="chrome-divider" />
        </div>

        {/* Bottom bar */}
        <div className="mx-auto max-w-7xl mt-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-muted/60 text-xs tracking-wider uppercase" style={{ fontFamily: "var(--font-mono)" }}>
            © {new Date().getFullYear()} DJS CodeAI. All rights reserved.
          </p>
          <p className="text-muted/60 text-xs tracking-wider uppercase" style={{ fontFamily: "var(--font-mono)" }}>
            Built with liquid chrome · DJSCE
          </p>
        </div>
      </div>
    </footer>
  );
}
