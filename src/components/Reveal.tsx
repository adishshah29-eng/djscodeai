"use client";

import { useRef, useEffect, useLayoutEffect, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// useLayoutEffect on the client (no pre-paint flash), useEffect on the server
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type Props = {
  children: ReactNode;
  className?: string;
  /** distance in px the element rises from */
  y?: number;
  delay?: number;
  /** when set, animates direct children in sequence instead of the wrapper */
  stagger?: number;
  /** ScrollTrigger start position */
  start?: string;
};

export default function Reveal({
  children,
  className,
  y = 28,
  delay = 0,
  stagger,
  start = "top 85%",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      const targets =
        stagger !== undefined ? Array.from(el.children) : el;

      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay,
          ease: "power2.out",
          stagger: stagger ?? 0,
          scrollTrigger: {
            trigger: el,
            start,
            once: true,
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [y, delay, stagger, start]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
