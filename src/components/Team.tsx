"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import NextImage from "next/image";

interface TeamMember {
  name: string;
  role: string;
  category: Category;
  bio: string;
  github?: string;
  linkedin?: string;
  email?: string;
  image?: string; // Optional image URL
}

type Category = "Faculty" | "Core" | "Tech" | "Events" | "Creatives";

const TEAM: TeamMember[] = [
  // ─── FEATURED (always visible) ───
  {
    name: "Meet Dawda",
    role: "Chairperson",
    category: "Core",
    image: "/team/meet.jpg",
    bio: "3+ years in Machine Learning research and development",
  },
  {
    name: "Juee Shimpi",
    role: "Vice Chairperson - Admin",
    image: "/team/jueeshimpi.jpg",
    category: "Core",
    bio: "Deep learning and neural network architectures",
  
  },
  {
    name: "Dr. Aruna Gawade",
    role: "HOD — AI & ML",
    category: "Faculty",
    bio: "15+ years of experience in AI and Computer Science",
    linkedin: "-gawade-37349a272",
    email: "hod.aiml@djsce.ac.in",
  },
  {
    name: "Prof. Purva",
    role: "Faculty Coordinator",
    category: "Faculty",
    bio: "Specialist in Machine Learning and Deep Learning",

  },

  // ─── REST (in "View More") ───
  {
    name: "Suruchi",
    role: "Secretary",
    category: "Core",
    bio: "Full-stack development and AI system integration",
  },
  {
    name: "Saad Sayed",
    role: "Vice Chairperson - Tech",
    image: "/team/saad.jpeg",
    category: "Tech",
    bio: "Deep Learning and NLP expertise",

  },
  {
    name: "Shreya Khanna",
    role: "Tech Mentor",
    category: "Core",
    bio: "",
  },
  {
    name: "Kavya Sajjit",
    role: "AI Mentor",
    category: "Core",
    image: "/team/kavyasj.jpeg",
    bio: "",
  },
  {
    name: "Abdul Qaddar",
    role: "Tech Mentor",
    category: "Core",
    image: "/team/abdul.jpg",
    bio: "",
  },
  {
    name: "Sayli Kulkarni",
    role: "Project Head",
    image: "/team/sayli.jpg",
    category: "Events",
    bio: "Communication and project leadership",
    email: "manav@djscodeai.com",
  },
  {
    name: "Swaleha Shaikh",
    role: "Events Head",
    category: "Events",
    bio: "Event management and coordination",
    github: "netrasangani",
    linkedin: "netra-sangani-573595232",
    email: "netrasangani@gmail.com",
  },
  {
    name: "Kavya Shah",
    role: "Events Head",
    image: "/team/kavyashah.jpg",
    category: "Events",
    bio: "Event management and coordination",
  },
  {
    name: "Adish Shah",
    role: "Marketing and Outreach Head",
    image: "/team/adish.jpg",
    category: "Events",
    bio: "Marketing strategy and outreach",
  },
  {
    name: "Manya Sanghvi",
    role: "Marketing and Outreach Head",
    category: "Events",
    bio: "Marketing strategy and outreach",
  },
  {
    name: "Tanishka Dhanudharmi",
    role: "Creatives Head",
    category: "Creatives",
    bio: "From algorithms to aesthetics — creativity is intelligence having fun",
    image: "/team/tanishka.jpg",
  },
   {
    name: "Yash Poojari",
    role: "Treasurer",
    category: "Events",
    bio: "Managing finances and budgeting for the team",
  },
];

// First 4 are featured (always visible)
const FEATURED = TEAM.slice(0, 4);
const REST = TEAM.slice(4);

// Role badge colour mapping
const ROLE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Chairperson:        { bg: "rgba(251,191,36,0.08)", text: "#FCD34D", border: "rgba(251,191,36,0.25)" },
  "Vice Chairperson": { bg: "rgba(167,139,250,0.08)", text: "#A78BFA", border: "rgba(167,139,250,0.25)" },
  "HOD — AI & ML":    { bg: "rgba(52,211,153,0.08)", text: "#34D399", border: "rgba(52,211,153,0.25)" },
  "Faculty Coordinator": { bg: "rgba(96,165,250,0.08)", text: "#60A5FA", border: "rgba(96,165,250,0.25)" },
};

function getRoleBadge(role: string) {
  return ROLE_COLORS[role] ?? { bg: "rgba(195,199,212,0.06)", text: "#A2A7B4", border: "rgba(195,199,212,0.15)" };
}

export default function Team() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section id="team" className="section-padding relative">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="section-label">( Team )</p>
          <h2 className="section-heading mb-6">
            The People Behind the Code
          </h2>
          <p className="section-subtext max-w-2xl mb-12">
            A diverse team of researchers, engineers, designers, and leaders
            united by a passion for artificial intelligence.
          </p>
        </Reveal>

        {/* ── FEATURED FOUR ── */}
        <Reveal
          stagger={0.08}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-glass-border rounded-2xl overflow-hidden mb-4"
        >
          {FEATURED.map((member) => (
            <MemberCard key={member.name} member={member} featured />
          ))}
        </Reveal>

        {/* ── VIEW MORE ACCORDION ── */}
        <div
          className="rounded-2xl border border-glass-border overflow-hidden"
          style={{ background: "var(--obsidian-2)" }}
        >
          {/* Toggle button */}
          <button
            id="team-view-more-btn"
            onClick={() => setExpanded((v) => !v)}
            className="w-full flex items-center justify-between px-6 py-4 group transition-colors duration-300 hover:bg-white/[0.02]"
            aria-expanded={expanded}
            aria-controls="team-more-members"
          >
            <span className="flex items-center gap-3">
              <span
                className="label-caps text-chrome-lo group-hover:text-chrome-mid transition-colors"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {expanded ? "Show Less" : `View More — ${REST.length} Members`}
              </span>
              <span className="h-[1px] flex-1 w-16 bg-glass-border" />
            </span>

            {/* Chevron */}
            <span
              className="flex items-center justify-center w-7 h-7 rounded-full border border-glass-border group-hover:border-chrome-lo transition-all duration-300"
              style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.35s ease, border-color 0.3s" }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 4.5L6 8L10 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-chrome-lo group-hover:text-chrome-mid transition-colors" />
              </svg>
            </span>
          </button>

          {/* Collapsible grid */}
          <div
            id="team-more-members"
            style={{
              maxHeight: expanded ? "4000px" : "0px",
              overflow: "hidden",
              transition: "max-height 0.55s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            <div className="border-t border-glass-border grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-glass-border">
              {REST.map((member) => (
                <MemberCard key={member.name} member={member} featured={false} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}function MemberCard({
  member,
  featured,
}: {
  member: TeamMember;
  featured: boolean;
}) {
  const [showDetails, setShowDetails] = useState(false);

  const badge = getRoleBadge(member.role);

  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <>
      {/* Member Card */}
      <button
        type="button"
        onClick={() => setShowDetails(true)}
        className="w-full text-left bg-obsidian-2 group relative overflow-hidden p-6 min-h-[390px] flex flex-col border border-glass-border transition-all duration-500 hover:bg-obsidian-3 hover:-translate-y-1 cursor-pointer"
        style={featured ? { background: "var(--obsidian-3)" } : {}}
        aria-label={`View details for ${member.name}`}
      >
        {/* Featured accent line */}
        {featured && (
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ background: badge.text }}
          />
        )}

        {/* Top row */}
        <div className="flex items-center justify-between mb-5">
          <span
            className="text-[10px] tracking-[0.25em] text-muted"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            MEMBER
          </span>

          {featured && (
            <span
              className="text-[9px] font-medium tracking-wider uppercase px-2.5 py-1 rounded-full"
              style={{
                background: badge.bg,
                color: badge.text,
                border: `1px solid ${badge.border}`,
                fontFamily: "var(--font-mono)",
              }}
            >
              {member.role}
            </span>
          )}
        </div>

        {/* Member Image */}
        <div className="w-full h-52 rounded-xl mb-6 bg-obsidian border border-glass-border overflow-hidden transition-all duration-500 group-hover:border-chrome-lo">
          {member.image ? (
            <NextImage
              src={member.image}
              alt={member.name}
              width={500}
              height={500}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="display-heading text-4xl text-chrome-lo group-hover:text-chrome-mid transition-colors">
                {initials}
              </span>
            </div>
          )}
        </div>

        {/* Name + Designation */}
        <div className="mt-auto">
          <h3 className="text-chrome-hi text-xl font-semibold tracking-tight leading-tight mb-3">
            {member.name}
          </h3>

          <div
            className="w-16 h-[2px] mb-3 transition-all duration-500 group-hover:w-24"
            style={{ background: badge.text }}
          />

          <p
            className="text-muted text-[10px] tracking-[0.18em] uppercase"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {member.role}
          </p>

          {/* Click hint */}
          <div className="mt-5 flex items-center justify-between text-muted">
            <span
              className="text-[9px] tracking-[0.15em] uppercase"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              View details
            </span>

            <span
              className="text-sm transition-transform duration-300 group-hover:translate-x-1"
              style={{ color: badge.text }}
            >
              →
            </span>
          </div>
        </div>
      </button>

      {/* Details Modal */}
      {showDetails && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setShowDetails(false)}
        >
          <div
            className="relative w-full max-w-lg bg-obsidian-2 border border-glass-border rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Accent */}
            <div
              className="absolute top-0 left-0 right-0 h-[3px]"
              style={{ background: badge.text }}
            />

            {/* Close */}
            <button
              type="button"
              onClick={() => setShowDetails(false)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full border border-glass-border flex items-center justify-center text-muted hover:text-chrome-hi hover:border-chrome-lo transition-colors"
              aria-label="Close member details"
            >
              ×
            </button>

            <div className="p-7">
              {/* Profile header */}
              <div className="flex items-center gap-5 mb-7">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-obsidian border border-glass-border flex-shrink-0">
                  {member.image ? (
                    <NextImage
                      src={member.image}
                      alt={member.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="display-heading text-2xl text-chrome-lo">
                        {initials}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <span
                    className="text-[9px] tracking-[0.18em] uppercase"
                    style={{
                      color: badge.text,
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {member.role}
                  </span>

                  <h2 className="text-chrome-hi text-2xl font-semibold mt-2">
                    {member.name}
                  </h2>
                </div>
              </div>

              {/* Bio */}
              {member.bio && (
                <div className="mb-7">
                  <p
                    className="text-[9px] tracking-[0.2em] uppercase text-muted mb-3"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    About
                  </p>

                  <p className="text-muted text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              )}

              {/* Social / Contact */}
              {(member.github || member.linkedin || member.email) && (
                <div className="pt-5 border-t border-glass-border">
                  <p
                    className="text-[9px] tracking-[0.2em] uppercase text-muted mb-4"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Connect
                  </p>

                  <div className="flex flex-wrap gap-3">
                    {member.github && (
                      <a
                        href={`https://github.com/${member.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-4 py-2 rounded-full border border-glass-border text-xs text-muted hover:text-chrome-hi hover:border-chrome-lo transition-colors"
                      >
                        GitHub
                      </a>
                    )}

                    {member.linkedin && (
                      <a
                        href={`https://linkedin.com/in/${member.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-4 py-2 rounded-full border border-glass-border text-xs text-muted hover:text-chrome-hi hover:border-chrome-lo transition-colors"
                      >
                        LinkedIn
                      </a>
                    )}

                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="px-4 py-2 rounded-full border border-glass-border text-xs text-muted hover:text-chrome-hi hover:border-chrome-lo transition-colors"
                      >
                        Email
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Close button */}
              <button
                type="button"
                onClick={() => setShowDetails(false)}
                className="mt-7 w-full py-3 rounded-lg border border-glass-border text-xs tracking-wider uppercase text-muted hover:text-chrome-hi hover:border-chrome-lo transition-colors"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}