"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-8 h-8 border border-chrome-lo border-t-chrome-mid rounded-full animate-spin" />
    </div>
  ),
});

export default function Hero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      <div className="mx-auto max-w-7xl w-full px-6 md:px-10 grid lg:grid-cols-2 gap-8 items-center pt-24 pb-16 lg:pt-0 lg:pb-0">
        {/* Left — Text */}
        <div
          className={`relative z-10 transition-all duration-[1500ms] delay-300 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="label-caps mb-5 text-accent tracking-[0.2em]">
            DJ Sanghvi College of Engineering
          </p>
          <h1 className="display-heading text-5xl md:text-6xl lg:text-7xl xl:text-8xl chrome-text-animated mb-6 leading-[1]">
            DJS
            <br />
            CodeAI
          </h1>
          <p className="text-muted text-base md:text-lg max-w-md mb-10 leading-relaxed">
            A student-led community fostering innovation in Artificial
            Intelligence and Machine Learning.
            <br />
            <span className="text-chrome-mid font-medium">
              Learn. Create. Innovate.
            </span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#projects"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-accent/10 border border-accent/30 text-accent text-sm font-medium tracking-wide transition-all duration-300 hover:bg-accent/20 hover:border-accent/50 hover:shadow-[0_0_30px_rgba(79,230,255,0.15)]"
            >
              Explore Projects
            </a>
            <a
              href="#about"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full border border-glass-border text-chrome-mid text-sm font-medium tracking-wide transition-all duration-300 hover:border-chrome-lo hover:text-chrome-hi"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Right — 3D Model */}
        <div
          className={`relative w-full aspect-square max-w-[600px] mx-auto lg:mx-0 transition-all duration-[2000ms] delay-500 ${
            visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <HeroScene />
          <p className="text-center text-muted/40 text-xs mt-2" style={{ fontFamily: "var(--font-mono)" }}>
            Drag to rotate
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-10 transition-all duration-1000 delay-[2000ms] ${
          visible ? "opacity-50" : "opacity-0"
        }`}
      >
        <div className="w-5 h-8 rounded-full border border-chrome-lo flex items-start justify-center p-1.5">
          <div className="w-0.5 h-2 bg-chrome-mid rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
