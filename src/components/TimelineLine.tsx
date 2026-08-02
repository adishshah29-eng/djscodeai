"use client";

import { useRef, useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** The events timeline spine — scrubs its height to scroll position. */
export default function TimelineLine() {
  const ref = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(el, { scaleY: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement,
            start: "top 80%",
            end: "bottom 70%",
            scrub: 0.5,
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-chrome-lo/50 via-chrome-lo/20 to-transparent"
      style={{ transformOrigin: "top center" }}
    />
  );
}
