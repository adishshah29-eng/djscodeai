"use client";

import { useState } from "react";
import Reveal from "./Reveal";

interface TeamMember {
  name: string;
  photo?:string;
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
    name: "Dr. Aruna Gawade",
    photo:"/team/arunamam.jfif",
    role: "HOD — AI & ML",
    category: "Faculty",
    bio: "15+ years of experience in AI and Computer Science",
    linkedin: "aruna-gawade-37349a272",
    email: "hod.aiml@djsce.ac.in",
  },
  {
    name: "Prof. Purva Badhe",
    photo:"/team/purvamam.png",
    role: "Faculty Coordinator",
    category: "Faculty",
    bio: "Specialist in Machine Learning and Deep Learning",
    email: "",
  },
  {
    name: "Meet Dawda",
    photo:"/team/meet.jpeg",
    role: "Chairperson",
    category: "Core",
    bio: "3+ years in Machine Learning research and development",
    github: "",
    linkedin: "meet-dawda-771714322",
    email: "",
  },
  {
    name: "Juee Shimpi",
    photo:"/team/juee.jpeg",
    role: "Vice Chairperson(Admin)",
    category: "Core",
    bio: "Deep learning and neural network architectures",
    github: "",
    linkedin: "juee-shimpi-253b5231a",
    email: "",
  },
  // ─── REST (in "View More") ───
  {
    name: "Saad Sayed",
    photo:"/team/saad.jpeg",
    role: "Vice Chairperson(Tech) & Tech — Web Dev",
    category: "Tech",
    bio: "Full-stack development with AI integration",
    github: "",
    linkedin: "saad-sayed-a04b0932b",
    email: "",
  },
  {
    name: "Yash Poojari",
    photo:"/team/yash.jpeg",
    role: "Treasurer",
    category: "Core",
    bio: "Financial planning and resource management",
    github: "",
    linkedin: "yash-poojari-8706y",
    email: "",
  },
   
  {

    name: "Suruchi Makwana",
    photo:"/team/suruchi.jpeg",
    role: "Secretary",
    category: "Core",
    bio: "Full-stack development and AI system integration",
    github: "",
    linkedin: "suruchi-makwana",
    email: "",
  },
  {
    name: "Shreya",
    photo:"/team/shreya.jpeg",
    role: "Tech — AI Mentor",
    category: "Tech",
    bio: "Deep Learning and NLP expertise",
    github: "",
    linkedin: "shreya-khanna1603",
    email: "",
  },
{
    name: "Kavya Sajjit",
    photo:"/team/kavyasajjit.jpeg",
    role: "Tech — AI Mentor",
    category: "Tech",
    bio: "NLP and Generative AI research",
    github: "",
    linkedin: "kavya-sajjit-53631b35a",
    email: "",
  },
  {
    name: "Abdulqadar Manasawala",
    photo:"/team/abdul.jpeg",
    role: "Tech - AI Research Mentor",
    category: "Tech",
    bio: "AI research, experimentation and model development",
    github: "",
    linkedin: "superbrainy007",
    email: "",
  },
  
 
  
  {
    name: "Sayli Kulkarni",
    photo:"/team/sayli.jpeg",
    role: "Project Head",
    category: "Events",
    bio: "Communication and project leadership",
    linkedin: "sayli-kulkarni-b7a34535a",
    email: "",
  },
  {
    name: "Kavya Shah",
    photo:"/team/kavyashah.jpeg",
    role: "Events Head",
    category: "Events",
    bio: "Event management and coordination",
    github: "",
    email: "",
  },
  {
    name: "Swaleha Shaikh",
    photo:"/team/swaleha.jpeg",
    role: "Events Head",
    category: "Events",
    linkedin: "swaleha-shaikh-7450aa34b",
    bio: "Event management and coordination",
  },
  {
    name: "Adish Shah",
    photo:"/team/adish.jpeg",
    role: "Marketing Head",
    category: "Creatives",
    linkedin: "adishshah29",

    bio: "Marketing strategy and outreach",
  },
  {
    name: "Manya Sanghvi",
    photo:"/team/manya.jpeg",
    role: "Marketing Head",
    category: "Creatives",
    linkedin: "manya-sanghvi-9b032b255",
    bio: "Marketing strategy and outreach",
  },
  {
    name: "Tanishka",
    photo:"/team/tanishka.jpeg",
    role: "Creatives Head",
    category: "Creatives",
    bio: "From algorithms to aesthetics — creativity is intelligence having fun",
    github: "",
    linkedin: "",
    email: "",
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
       className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8"
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

function MemberCard({
  member,
  featured,
}: {
  member: TeamMember;
  featured: boolean;
}) {
  const badge = getRoleBadge(member.role);

  return (
    <div
      className={`
        group relative overflow-hidden
        rounded-xl border border-glass-border
        bg-[#11100f]
        transition-all duration-500
        hover:-translate-y-2
        hover:z-20
        ${featured ? "h-[210px]" : "h-[190px]"}
      `}
    >
      {/* Top accent line */}
      {featured && (
        <div
          className="absolute top-0 left-0 right-0 h-[3px] z-10"
          style={{ background: badge.text }}
        />
      )}

      <div className="flex h-full">

        {/* PHOTO */}
        <div className="relative w-[45%] h-full overflow-hidden bg-obsidian">
          {member.photo ? (
            <img
              src={member.photo}
              alt={member.name}
              className="
                absolute inset-0
                w-full h-full
                object-cover
                grayscale-[20%]
                transition-all duration-700
                group-hover:scale-105
                group-hover:grayscale-0
              "
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="display-heading text-3xl text-chrome-lo">
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
          )}

          {/* Image gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30" />
        </div>

        {/* INFORMATION */}
        <div
          className="w-[55%] p-4 flex flex-col justify-between"
          style={{
            background: featured
              ? `linear-gradient(135deg, ${badge.bg}, #11100f 70%)`
              : "#11100f",
          }}
        >
          <div>

            {/* Role */}
            <p
              className="text-[9px] uppercase tracking-widest mb-2"
              style={{
                color: badge.text,
                fontFamily: "var(--font-mono)",
              }}
            >
              {member.role}
            </p>

            {/* Name */}
            <h3 className="text-chrome-hi text-base font-semibold leading-tight">
              {member.name}
            </h3>

            {/* About */}
            {member.bio && (
              <p className="text-muted text-[10px] leading-relaxed mt-3 line-clamp-4">
                {member.bio}
              </p>
            )}
          </div>

          {/* Social links */}
          <div className="flex gap-2 mt-3">

            {member.github && (
              <a
                href={`https://github.com/${member.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-chrome-hi transition-colors"
                aria-label={`${member.name} GitHub`}
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
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
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 10.001-4.124 2.062 2.062 0 00-.001 4.124zM7.119 20.452H3.555V9h3.564v11.452z" />
                </svg>
              </a>
            )}

            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="text-muted hover:text-chrome-hi transition-colors"
                aria-label={`Email ${member.name}`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 00-2 2z"
                  />
                </svg>
              </a>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
