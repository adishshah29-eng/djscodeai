"use client";

import dynamic from "next/dynamic";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-8 h-8 border border-chrome-lo border-t-chrome-mid rounded-full animate-spin" />
    </div>
  ),
});

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);

  const l1Ref = useRef<HTMLDivElement>(null);
  const l2Ref = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 1024px)",
          isMobile: "(max-width: 1023px)",
        },
        (context) => {
          const isDesktop = context.conditions?.isDesktop ?? false;
          const leftX = () => (isDesktop ? -window.innerWidth * 0.26 : 0);

          // initial states
          gsap.set(l1Ref.current, { x: 0, opacity: 1 });
          gsap.set(l2Ref.current, { x: leftX, opacity: 0, y: 20 });

          const proxy = { v: 0 };

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: () => "+=" + window.innerHeight * 3,
              scrub: 1,
              pin: stageRef.current,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          // drive the 3D scene progress (scrubbed → smooth)
          tl.to(
            proxy,
            {
              v: 1,
              duration: 1,
              ease: "none",
              onUpdate: () => {
                progressRef.current = proxy.v;
              },
            },
            0
          );

          // first text slides left, then fades
          tl.to(l1Ref.current, { x: leftX, duration: 0.2, ease: "none" }, 0.34);
          tl.to(l1Ref.current, { opacity: 0, duration: 0.08 }, 0.54);

          // second text fades in on the left
          tl.to(
            l2Ref.current,
            { opacity: 1, y: 0, duration: 0.12 },
            0.62
          );

          // scroll hint fades out early
          tl.to(hintRef.current, { opacity: 0, duration: 0.08 }, 0.04);
        }
      );
    }, sectionRef);

    // recalc once everything (fonts / model) settles
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      ctx.revert();
    };
  }, []);

  return (
    <section id="home" ref={sectionRef} className="relative">
      <div
        ref={stageRef}
        className="hero-stage h-screen w-full relative overflow-hidden flex items-center justify-center"
      >
        {/* 3D canvas */}
        <div className="absolute inset-0 z-0">
          <HeroScene progressRef={progressRef} />
        </div>

        {/* Text layer 1 — centered, then slides left */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none px-6">
          <div ref={l1Ref} className="text-center lg:text-left max-w-xl">
            <p className="label-caps mb-5 text-accent tracking-[0.25em]">
              DJ Sanghvi College of Engineering
            </p>
            <h1 className="display-heading text-6xl md:text-8xl lg:text-9xl chrome-text-animated leading-[0.92]">
              DJS
              <br />
              CodeAI
            </h1>
            <p className="text-muted text-base md:text-lg mt-6">
              Fostering innovation in Artificial Intelligence &amp; Machine
              Learning
            </p>
          </div>
        </div>

        {/* Text layer 2 — the philosophy, on the left */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none px-6">
          <div ref={l2Ref} className="text-center lg:text-left max-w-xl">
            <p className="label-caps mb-5 text-accent tracking-[0.25em]">
              Our Philosophy
            </p>
            <h2 className="display-heading text-4xl md:text-6xl lg:text-7xl chrome-text leading-[1.05] mb-6">
              The reach
              <br />
              never closes
            </h2>
            <p className="text-muted text-base md:text-lg mb-8 leading-relaxed">
              The gap between the hand and the mind is the whole pursuit — a
              reach for intelligence that never stops.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pointer-events-auto">
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
        </div>

        {/* Scroll hint */}
        <div
          ref={hintRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <span
            className="text-muted text-[10px] tracking-[0.2em] uppercase"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Scroll
          </span>
          <div className="w-5 h-8 rounded-full border border-chrome-lo flex items-start justify-center p-1.5">
            <div className="w-0.5 h-2 bg-chrome-mid rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
