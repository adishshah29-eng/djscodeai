"use client";

import { useState, type FormEvent } from "react";

export default function Contact() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    }, 1500);
  }

  return (
    <section id="contact" className="section-padding relative">
      <div className="mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left — info */}
          <div>
            <p className="label-caps mb-4 text-accent">Contact</p>
            <h2 className="display-heading text-3xl md:text-5xl chrome-text mb-6">
              Get in Touch
            </h2>
            <p className="text-muted text-lg mb-12 leading-relaxed">
              Have a question, want to collaborate, or interested in joining?
              We&apos;d love to hear from you.
            </p>

            {/* Contact details */}
            <div className="space-y-6">
              <ContactDetail
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                }
                label="Email"
                value="contact.djscodeai@gmail.com"
                href="mailto:contact.djscodeai@gmail.com"
              />
              <ContactDetail
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                }
                label="Phone"
                value="+91 8104665118"
                href="tel:+918104665118"
              />
              <ContactDetail
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                }
                label="Location"
                value="DJ Sanghvi College of Engineering, Mumbai"
                href="https://maps.app.goo.gl/PaaeHRtug1iow6br5"
              />
            </div>

            {/* Social links */}
            <div className="flex gap-4 mt-12">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full bg-obsidian-2 border border-glass-border flex items-center justify-center text-muted transition-all duration-300 hover:text-chrome-hi hover:border-chrome-lo hover:bg-obsidian-3"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div className="glass-card rounded-2xl p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <FormField
                label="Name"
                name="name"
                type="text"
                placeholder="Your name"
              />
              <FormField
                label="Email"
                name="email"
                type="email"
                placeholder="you@example.com"
              />
              <FormField
                label="Subject"
                name="subject"
                type="text"
                placeholder="What's this about?"
              />
              <div>
                <label
                  htmlFor="message"
                  className="label-caps block mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Your message..."
                  className="w-full bg-obsidian-3 border border-glass-border rounded-xl px-4 py-3 text-chrome-hi text-sm placeholder-muted/50 resize-none transition-all duration-300 focus:outline-none focus:border-chrome-lo focus:ring-1 focus:ring-chrome-lo/30"
                  required
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={sending || sent}
                className="group relative w-full py-3.5 rounded-full text-sm font-medium tracking-wide overflow-hidden transition-all duration-500 disabled:opacity-60"
              >
                {/* Background gradient */}
                <span className="absolute inset-0 bg-gradient-to-r from-chrome-lo via-chrome-mid to-chrome-lo bg-[length:200%_100%] group-hover:animate-[chrome-sweep_2s_ease-in-out_infinite]" />
                <span className="absolute inset-[1px] bg-obsidian-2 rounded-full" />
                <span className="relative z-10 text-chrome-hi">
                  {sent ? "Sent!" : sending ? "Sending..." : "Send Message"}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function FormField({
  label,
  name,
  type,
  placeholder,
}: {
  label: string;
  name: string;
  type: string;
  placeholder: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="label-caps block mb-2">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className="w-full bg-obsidian-3 border border-glass-border rounded-xl px-4 py-3 text-chrome-hi text-sm placeholder-muted/50 transition-all duration-300 focus:outline-none focus:border-chrome-lo focus:ring-1 focus:ring-chrome-lo/30"
        required
      />
    </div>
  );
}

function ContactDetail({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="flex items-start gap-4 group"
    >
      <div className="w-10 h-10 rounded-lg bg-obsidian-2 border border-glass-border flex items-center justify-center text-muted group-hover:text-accent transition-colors shrink-0">
        {icon}
      </div>
      <div>
        <p className="label-caps mb-0.5">{label}</p>
        <p className="text-chrome-mid text-sm group-hover:text-chrome-hi transition-colors">
          {value}
        </p>
      </div>
    </a>
  );
}

const SOCIALS = [
  {
    label: "GitHub",
    href: "https://github.com/djs-codeai",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/djs-codeai",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com/djs_codeai",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
];
