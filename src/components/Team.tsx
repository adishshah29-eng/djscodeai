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

const CATEGORIES: Category[] = ["Faculty", "Core", "Tech", "Events", "Creatives"];

const TEAM: TeamMember[] = [
  {
    name: "Dr. Aruna Gawade",
    role: "Head of Department",
    category: "Faculty",
    bio: "15+ years of experience in AI and Computer Science",
    linkedin: "aruna-gawade-37349a272",
    email: "hod.aiml@djsce.ac.in",
  },
  {
    name: "Prof. Ragini Mishra",
    role: "Assistant Professor",
    category: "Faculty",
    bio: "Specialist in Machine Learning and Deep Learning",
    email: "ragini.mishra@djsce.ac.in",
  },
  {
    name: "Krishil Parikh",
    role: "President",
    category: "Core",
    bio: "3+ years in Machine Learning research and development",
    github: "Krishil-Parikh",
    linkedin: "krishil-parikh-3ba06b287",
    email: "krishil.prkh75@gmail.com",
  },
  {
    name: "Krisha Maisheri",
    role: "Vice President",
    category: "Core",
    bio: "Deep learning and neural network architectures",
    github: "krishamaisheri",
    linkedin: "krisha-maisheri-a48782281",
    email: "krisha.maisheri16@gmail.com",
  },
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
    name: "Jigar Gada",
    role: "Marketing Head",
    category: "Creatives",
    bio: "Marketing strategy and outreach",
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
    name: "Vruddhi Zaveri",
    role: "Creatives Head",
    category: "Creatives",
    bio: "From algorithms to aesthetics — creativity is intelligence having fun",
    github: "vruddhiZaveri",
    linkedin: "vruddhi-zaveri-996a9a289",
    email: "vruddhi.zaveri@gmail.com",
  },
];

export default function Team() {
  const [activeFilter, setActiveFilter] = useState<Category | "All">("All");
  const [showAll, setShowAll] = useState(false);

  const filtered =
    activeFilter === "All"
      ? TEAM
      : TEAM.filter((m) => m.category === activeFilter);

  const visible = showAll ? filtered : filtered.slice(0, 8);

  return (
    <section id="team" className="section-padding relative">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="label-caps mb-4 text-accent">Our Team</p>
          <h2 className="display-heading text-3xl md:text-5xl chrome-text mb-6">
            The People Behind the Code
          </h2>
          <p className="text-muted text-lg max-w-2xl mb-12">
            A diverse team of researchers, engineers, designers, and leaders
            united by a passion for artificial intelligence.
          </p>
        </Reveal>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-12">
          {(["All", ...CATEGORIES] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveFilter(cat);
                setShowAll(false);
              }}
              className={`px-4 py-2 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-300 ${
                activeFilter === cat
                  ? "bg-accent/15 text-accent border border-accent/30"
                  : "bg-obsidian-2 text-muted border border-glass-border hover:text-chrome-hi hover:border-chrome-lo"
              }`}
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <Reveal
          stagger={0.06}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-glass-border rounded-2xl overflow-hidden"
        >
          {visible.map((member) => (
            <MemberCard key={member.name} member={member} />
          ))}
        </Reveal>

        {/* Show more */}
        {filtered.length > 8 && !showAll && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => setShowAll(true)}
              className="group relative px-8 py-3 rounded-full border border-chrome-lo text-chrome-mid text-sm font-medium tracking-wide overflow-hidden transition-all duration-500 hover:border-chrome-mid hover:text-chrome-hi"
            >
              <span className="relative z-10">
                Show All ({filtered.length - 8} more)
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-chrome-lo/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function MemberCard({ member }: { member: TeamMember }) {
  return (
    <div className="bg-obsidian-2 p-6 group hover:bg-obsidian-3 transition-all duration-500 relative">
      {/* Avatar placeholder */}
      <div className="w-16 h-16 rounded-full mb-5 bg-obsidian-3 border border-glass-border flex items-center justify-center overflow-hidden group-hover:border-chrome-lo transition-colors duration-500">
        <span className="display-heading text-xl text-chrome-lo group-hover:text-chrome-mid transition-colors">
          {member.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </span>
      </div>

      {/* Info */}
      <h3 className="text-chrome-hi text-sm font-semibold mb-1">
        {member.name}
      </h3>
      <p
        className="text-accent text-xs tracking-wider uppercase mb-2"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {member.role}
      </p>
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
