"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type CSSProperties,
} from "react";
import Reveal from "./Reveal";

interface Project {
  title: string;
  description: string;
  tags: string[];
  demo: string;
  github?: string;
}

const PROJECTS: Project[] = [
  {
    title: "Parmar Properties",
    description:
      "Production landing page for a Mumbai real-estate firm — property showcase, inquiry funnel, and marketing pages built for conversion.",
    tags: ["Next.js", "Landing Page", "Marketing"],
    demo: "https://parmarproperties.in",
  },
  {
    title: "Meta CRM Dashboard",
    description:
      "A full CRM analytics dashboard with lead pipelines, activity tracking, and performance charts — designed for teams running Meta ad campaigns.",
    tags: ["Next.js", "Dashboard", "Analytics", "CRM"],
    demo: "https://meta-crm-phi.vercel.app/dashboard",
  },
  {
    title: "Resunova",
    description:
      "An AI-powered resume builder that turns raw experience into ATS-friendly, recruiter-ready résumés with live editing and instant PDF export.",
    tags: ["AI", "LLM", "Next.js", "PDF"],
    demo: "https://resunova.io",
  },
  {
    title: "Interior Designer",
    description:
      "A portfolio and lead-gen site for an interior design studio — moodboard-first layout with project galleries and a clean inquiry flow.",
    tags: ["Next.js", "Portfolio", "Design"],
    demo: "https://interior-designer-two-omega.vercel.app",
  },
  {
    title: "DJS Astra",
    description:
      "Website for Astra — event schedule, registrations, and sponsor showcase, built with a bold immersive visual language.",
    tags: ["Next.js", "Events", "Immersive"],
    demo: "https://djs-astra.vercel.app",
  },
  {
    title: "Grece — Henna Studio",
    description:
      "Elegant, high-conversion site for a boutique henna studio — service catalog, portfolio, and booking flow with a luxury visual language.",
    tags: ["Next.js", "Boutique", "Booking"],
    demo: "https://grece-henna.vercel.app",
  },
  {
    title: "Grece 3D Walkthrough",
    description:
      "Immersive in-browser 3D room walkthrough and virtual tour — navigate the space with real-time WebGL rendering.",
    tags: ["Three.js", "WebGL", "3D Tour"],
    demo: "https://grece-henna.vercel.app/walkthrough",
  },
  {
    title: "Neuron",
    description:
      "An AI-forward product experience — an interactive interface for neural exploration and visualization.",
    tags: ["AI", "Next.js", "Interactive"],
    demo: "https://neuron-mu.vercel.app",
  },
  {
    title: "Bike Marketplace",
    description:
      "A two-sided marketplace for buying and selling bikes — listings, filters, seller profiles, and inquiry flow.",
    tags: ["Marketplace", "Next.js", "Full-Stack"],
    demo: "https://bike-three-theta.vercel.app",
  },
];

function hostOf(url: string) {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

// ─── Browser chrome bar (shared) ────────────────────────────────────────
function BrowserDots() {
  return (
    <div className="flex items-center gap-1.5" aria-hidden="true">
      <span className="w-2.5 h-2.5 rounded-full bg-chrome-lo/70" />
      <span className="w-2.5 h-2.5 rounded-full bg-chrome-lo/50" />
      <span className="w-2.5 h-2.5 rounded-full bg-chrome-lo/40" />
    </div>
  );
}

// ─── Grid card with hover-loaded live preview ────────────────────────────
function ProjectCard({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.3);
  const [everHovered, setEverHovered] = useState(false);
  const [hovered, setHovered] = useState(false);
  const DESIGN_W = 1280;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      if (w > 0) setScale(w / DESIGN_W);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const iframeStyle: CSSProperties = {
    width: `${DESIGN_W}px`,
    height: `${DESIGN_W * 0.625}px`,
    transform: `scale(${scale})`,
    transformOrigin: "top left",
    pointerEvents: "none",
    border: 0,
  };

  return (
    <button
      type="button"
      onClick={onOpen}
      onMouseEnter={() => {
        setHovered(true);
        setEverHovered(true);
      }}
      onMouseLeave={() => setHovered(false)}
      className="group relative text-left rounded-2xl overflow-hidden border border-glass-border bg-obsidian-2 transition-all duration-500 hover:border-chrome-lo hover:-translate-y-1 hover:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9)] focus:outline-none focus-visible:border-chrome-mid"
    >
      {/* Browser chrome bar */}
      <div className="flex items-center gap-3 px-4 h-9 border-b border-glass-border bg-obsidian-3/60">
        <BrowserDots />
        <span
          className="flex-1 truncate text-[11px] text-muted"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {hostOf(project.demo)}
        </span>
      </div>

      {/* Preview area */}
      <div
        ref={wrapRef}
        className="relative aspect-[16/10] overflow-hidden bg-obsidian-3"
      >
        {/* Poster (default state) */}
        <div
          className={`absolute inset-0 flex flex-col justify-between p-6 transition-opacity duration-500 ${
            hovered ? "opacity-0" : "opacity-100"
          }`}
          style={{
            background:
              "linear-gradient(150deg, #16171d 0%, #0b0b0e 55%, #050506 100%)",
          }}
        >
          <span
            className="display-heading text-5xl text-chrome-lo/60"
            aria-hidden="true"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <h3 className="display-heading text-xl text-chrome-hi mb-1">
              {project.title}
            </h3>
            <p className="text-muted text-xs">{project.tags.slice(0, 3).join(" · ")}</p>
          </div>
        </div>

        {/* Live preview (mounts on first hover, stays mounted) */}
        {everHovered && (
          <iframe
            src={project.demo}
            title={`${project.title} live preview`}
            loading="lazy"
            referrerPolicy="no-referrer"
            style={iframeStyle}
            className={`absolute inset-0 transition-opacity duration-700 ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {/* Hover CTA */}
        <div className="absolute inset-0 flex items-end justify-end p-4 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-chrome-hi text-obsidian text-xs font-semibold opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            View project
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H8M17 7v9" />
            </svg>
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-chrome-hi text-sm font-semibold">
            {project.title}
          </h3>
          <svg
            className="w-4 h-4 text-muted shrink-0 transition-all duration-300 group-hover:text-chrome-hi group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H8M17 7v9" />
          </svg>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {project.tags.map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 rounded-full text-[10px] border border-chrome-lo/40 text-muted"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}

// ─── Case-study modal with full live site ────────────────────────────────
function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const loadedRef = useRef(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    // if the iframe hasn't loaded in 6s, assume it blocks embedding
    const t = window.setTimeout(() => {
      if (!loadedRef.current) setBlocked(true);
    }, 6000);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [onClose]);

  const handleLoad = () => {
    loadedRef.current = true;
    setLoaded(true);
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-md animate-[fadeIn_0.3s_ease]"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${project.title} preview`}
        className="relative w-full max-w-6xl h-[85vh] flex flex-col rounded-2xl overflow-hidden border border-glass-border bg-obsidian-2 shadow-2xl animate-[modalPop_0.4s_cubic-bezier(0.16,1,0.3,1)]"
      >
        {/* Browser chrome */}
        <div className="flex items-center gap-3 px-4 h-12 border-b border-glass-border bg-obsidian-3 shrink-0">
          <BrowserDots />
          <div
            className="flex-1 flex items-center justify-center px-4 h-7 rounded-full bg-obsidian-2 border border-glass-border text-xs text-muted truncate max-w-md mx-auto"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {hostOf(project.demo)}
          </div>
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-chrome-mid hover:text-chrome-hi border border-glass-border hover:border-chrome-lo transition-colors"
          >
            Open
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H8M17 7v9" />
            </svg>
          </a>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="w-8 h-8 rounded-full flex items-center justify-center text-muted hover:text-chrome-hi hover:bg-obsidian-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Live site */}
        <div className="relative flex-1 bg-obsidian-3">
          {!loaded && !blocked && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border border-chrome-lo border-t-chrome-mid rounded-full animate-spin" />
            </div>
          )}

          {blocked ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 gap-4">
              <p className="text-chrome-mid text-sm max-w-sm">
                This site blocks embedding for security. Open it in a new tab to
                explore the live version.
              </p>
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-chrome-hi text-obsidian text-sm font-semibold"
              >
                Open live site
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H8M17 7v9" />
                </svg>
              </a>
            </div>
          ) : (
            <iframe
              src={project.demo}
              title={`${project.title} live site`}
              referrerPolicy="no-referrer"
              onLoad={handleLoad}
              className="w-full h-full border-0"
            />
          )}
        </div>

        {/* Info strip */}
        <div className="shrink-0 border-t border-glass-border bg-obsidian-2 px-5 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="display-heading text-lg text-chrome-hi">
                {project.title}
              </h3>
              <p className="text-muted text-xs mt-1 max-w-2xl leading-relaxed">
                {project.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 shrink-0">
              {project.tags.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-full text-[10px] border border-chrome-lo/40 text-chrome-mid"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────
export default function Projects() {
  const [active, setActive] = useState<Project | null>(null);
  const open = useCallback((p: Project) => setActive(p), []);
  const close = useCallback(() => setActive(null), []);

  return (
    <section id="projects" className="section-padding relative">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="label-caps mb-4 text-accent">Projects</p>
          <h2 className="display-heading text-3xl md:text-5xl chrome-text mb-6">
            Selected Work
          </h2>
          <p className="text-silver text-lg max-w-2xl mb-14">
            Real products, shipped and live. Hover any card for a live preview —
            click to explore the full site inside the page.
          </p>
        </Reveal>

        <Reveal
          stagger={0.08}
          className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6"
        >
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.title} project={p} index={i} onOpen={() => open(p)} />
          ))}
        </Reveal>
      </div>

      {active && <ProjectModal project={active} onClose={close} />}
    </section>
  );
}
