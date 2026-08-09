"use client";

import { useState } from "react";
import Reveal from "./Reveal";

interface TeamMember {
  name: string;
  role: string;
  category: Category;
  bio: string;
  github?: string;
  linkedin?: string;
  email?: string;
}

type Category = "Faculty" | "Core" | "Tech" | "Events" | "Creatives";

const TEAM: TeamMember[] = [
  // ─── FEATURED (always visible) ───
  {
    name: "Krishil Parikh",
    role: "Chairperson",
    category: "Core",
    bio: "3+ years in Machine Learning research and development",
    github: "Krishil-Parikh",
    linkedin: "krishil-parikh-3ba06b287",
    email: "krishil.prkh75@gmail.com",
  },
  {
    name: "Krisha Maisheri",
    role: "Vice Chairperson",
    category: "Core",
    bio: "Deep learning and neural network architectures",
    github: "krishamaisheri",
    linkedin: "krisha-maisheri-a48782281",
    email: "krisha.maisheri16@gmail.com",
  },
  {
    name: "Dr. Aruna Gawade",
    role: "HOD — AI & ML",
    category: "Faculty",
    bio: "15+ years of experience in AI and Computer Science",
    linkedin: "aruna-gawade-37349a272",
    email: "hod.aiml@djsce.ac.in",
  },
  {
    name: "Prof. Ragini Mishra",
    role: "Faculty Coordinator",
    category: "Faculty",
    bio: "Specialist in Machine Learning and Deep Learning",
    email: "ragini.mishra@djsce.ac.in",
  },

  // ─── REST (in "View More") ───
  {
    name: "Rishee Panchal",
    role: "Secretary",
    category: "Core",
    bio: "Full-stack development and AI system integration",
    github: "risheeee",
    linkedin: "rishee-panchal",
    email: "rishrash2712@gmail.com",
  },
  {
    name: "Deep Mehta",
    role: "Admin",
    category: "Core",
    bio: "Finance and analytical tools development",
    github: "DeepMehta561",
    linkedin: "deep-mehta-b2b126253",
    email: "deepmehta2005@gmail.com",
  },
  {
    name: "Keyush Nisar",
    role: "Tech — AI",
    category: "Tech",
    bio: "Deep Learning and NLP expertise",
    github: "nisaral",
    linkedin: "keyush-n-017a3a2b3",
    email: "nisarkeyush3@gmail.com",
  },
  {
    name: "Bhavya Goyal",
    role: "Tech — AI",
    category: "Tech",
    bio: "NLP and Generative AI research",
    github: "BhavyaGoyal777",
    email: "bhavyagoyal702@gmail.com",
  },
  {
    name: "Taitil Chheda",
    role: "Tech — AI",
    category: "Tech",
    bio: "Machine Learning and Deep Learning pipelines",
    github: "Taitilchheda",
    email: "taitil@gmail.com",
  },
  {
    name: "Rugved Kulkarni",
    role: "Tech — AI",
    category: "Tech",
    bio: "Machine Learning model development",
    github: "rugvedkulkarni30",
    linkedin: "rugved-kulkarni-19649b2b5",
    email: "kulkarni.rugved.m@gmail.com",
  },
  {
    name: "Manav Gohil",
    role: "Tech — Web Dev",
    category: "Tech",
    bio: "Full-stack development with AI integration",
    github: "TheManavGohil",
    linkedin: "manavgohil",
    email: "gohilmanav2005@gmail.com",
  },
  {
    name: "Manav Jobanputra",
    role: "Project Head",
    category: "Events",
    bio: "Communication and project leadership",
    email: "manav@djscodeai.com",
  },
  {
    name: "Parv Siria",
    role: "Project Head",
    category: "Events",
    bio: "Communication and project leadership",
    email: "parv@djscodeai.com",
  },
  {
    name: "Netra Sangani",
    role: "Events Head",
    category: "Events",
    bio: "Event management and coordination",
    github: "netrasangani",
    linkedin: "netra-sangani-573595232",
    email: "netrasangani@gmail.com",
  },
  {
    name: "Mitvi Dattani",
    role: "Events Head",
    category: "Events",
    bio: "Event management and coordination",
  },
  {
    name: "Jigar Gada",
    role: "Marketing Head",
    category: "Creatives",
    bio: "Marketing strategy and outreach",
  },
  {
    name: "Vruddhi Zaveri",
    role: "Creatives Head",
    category: "Creatives",
    bio: "From algorithms to aesthetics — creativity is intelligence having fun",
    github: "vruddhiZaveri",
    linkedin: "vruddhi-zaveri-996a9a289",
    email: "vruddhi.zaveri@gmail.com",
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
}

function MemberCard({ member, featured }: { member: TeamMember; featured: boolean }) {
  const badge = getRoleBadge(member.role);

  return (
    <div
      className="bg-obsidian-2 p-6 group hover:bg-obsidian-3 transition-all duration-500 relative overflow-hidden"
      style={featured ? { background: "var(--obsidian-3)" } : {}}
    >
      {featured && (
        <div
          className="absolute top-0 left-0 right-0 h-[3px]"
          style={{ background: badge.text }}
        />
      )}
      {/* Avatar */}
      <div className="w-14 h-14 rounded-full mb-5 bg-obsidian border border-glass-border flex items-center justify-center overflow-hidden group-hover:border-chrome-lo transition-colors duration-500">
        <span className="display-heading text-lg text-chrome-lo group-hover:text-chrome-mid transition-colors">
          {member.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </span>
      </div>

      {/* Featured badge for top-4 */}
      {featured && (
        <span
          className="absolute top-4 right-4 text-[9px] font-medium tracking-wider uppercase px-2 py-0.5 rounded-full"
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

      {/* Info */}
      <h3 className="text-chrome-hi text-sm font-semibold mb-1">{member.name}</h3>
      {!featured && (
        <p
          className="text-accent text-xs tracking-wider uppercase mb-2"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {member.role}
        </p>
      )}
      <p className="text-muted text-xs leading-relaxed mb-4">{member.bio}</p>

      {/* Social links */}
      <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        {member.github && (
          <a
            href={`https://github.com/${member.github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-chrome-hi transition-colors"
            aria-label={`${member.name} GitHub`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
        )}
        {member.linkedin && (
          <a
            href={`https://linkedin.com/in/${member.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-chrome-hi transition-colors"
            aria-label={`${member.name} LinkedIn`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        )}
        {member.email && (
          <a
            href={`mailto:${member.email}`}
            className="text-muted hover:text-chrome-hi transition-colors"
            aria-label={`Email ${member.name}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}
