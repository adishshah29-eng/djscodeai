"use client";

import { useState, useRef, useCallback } from "react";
import Reveal from "./Reveal";

interface Project {
  title: string;
  description: string;
  tags: string[];
  github?: string;
  demo?: string;
}

const PROJECTS: Project[] = [
  {
    title: "Deep Generative Models",
    description:
      "A curated collection of deep generative model implementations built from scratch using PyTorch. Covers GANs, VAEs, Diffusion Models, and Flows with visual outputs, loss curves, and detailed documentation.",
    tags: ["PyTorch", "GANs", "VAE", "Diffusion"],
    github: "BhavyaGoyal777/deep-generative-models",
  },
  {
    title: "FinteX Financial Analysis",
    description:
      "An intelligent financial analysis system that leverages machine learning to provide real-time market insights, portfolio optimization, and risk assessment for data-driven investment decisions.",
    tags: ["Python", "ML", "Finance", "Analytics"],
  },
  {
    title: "Paper Implementations",
    description:
      "Faithful reproductions of influential AI research papers, implementing architectures and training procedures from scratch to deepen understanding and validate published results.",
    tags: ["Research", "PyTorch", "Papers", "Deep Learning"],
  },
  {
    title: "Voice-Driven Multi-Agent Finance Assistant",
    description:
      "A multi-agent system powered by voice commands that coordinates specialized AI agents for financial research, analysis, and portfolio management through natural speech interaction.",
    tags: ["Multi-Agent", "Voice AI", "Finance", "LLM"],
  },
  {
    title: "MindCompanion",
    description:
      "An AI-powered mental health platform providing personalized support through conversational AI, sentiment analysis, and evidence-based therapeutic techniques for accessible wellness care.",
    tags: ["NLP", "Healthcare", "Sentiment Analysis", "AI Ethics"],
  },
  {
    title: "ACAF — Affective Contextual Analysis",
    description:
      "A framework for understanding emotional context in text and speech, combining affective computing with contextual analysis for nuanced sentiment and emotion recognition.",
    tags: ["Affective Computing", "NLP", "Context Analysis"],
  },
];

export default function Projects() {
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setTilt({ x: y * -8, y: x * 8 });
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  const project = PROJECTS[activeIndex];

  return (
    <section id="projects" className="section-padding relative">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="label-caps mb-4 text-accent">Projects</p>
          <h2 className="display-heading text-3xl md:text-5xl chrome-text mb-6">
            What We Build
          </h2>
          <p className="text-muted text-lg max-w-2xl mb-16">
            From generative models to financial systems — real research,
            real code, real impact.
          </p>
        </Reveal>

        <Reveal className="grid lg:grid-cols-[1fr_320px] gap-12 items-start">
          {/* Main stage */}
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="glass-card rounded-2xl p-8 md:p-12 transition-transform duration-200 ease-out"
            style={{
              transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            }}
          >
            {/* Project number */}
            <span className="label-caps text-chrome-lo mb-6 block">
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(PROJECTS.length).padStart(2, "0")}
            </span>

            <h3 className="display-heading text-2xl md:text-4xl text-chrome-hi mb-6">
              {project.title}
            </h3>

            <p className="text-muted text-sm md:text-base leading-relaxed mb-8 max-w-xl">
              {project.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs border border-chrome-lo/50 text-chrome-mid bg-obsidian-3"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex gap-4">
              {project.github && (
                <a
                  href={`https://github.com/${project.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-obsidian-3 border border-chrome-lo text-chrome-mid text-sm transition-all duration-300 hover:border-chrome-mid hover:text-chrome-hi"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  Source
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent/10 border border-accent/30 text-accent text-sm transition-all duration-300 hover:bg-accent/20"
                >
                  Live Demo
                </a>
              )}
            </div>
          </div>

          {/* Project list sidebar */}
          <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {PROJECTS.map((p, i) => (
              <button
                key={p.title}
                onClick={() => setActiveIndex(i)}
                className={`text-left px-5 py-4 rounded-xl transition-all duration-300 shrink-0 ${
                  i === activeIndex
                    ? "glass-card border-chrome-lo/30"
                    : "hover:bg-obsidian-2"
                }`}
              >
                <span className="label-caps block mb-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`text-sm font-medium transition-colors ${
                    i === activeIndex ? "text-chrome-hi" : "text-muted"
                  }`}
                >
                  {p.title}
                </span>
              </button>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
