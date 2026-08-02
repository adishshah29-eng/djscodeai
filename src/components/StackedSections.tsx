"use client";

import { useRef, useEffect, useLayoutEffect, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Stacked-card scroll: each panel slides up to cover the full screen while the
 * previous one is held behind it, then releases so the covering panel scrolls
 * through its own content normally before the next panel rises.
 */
export default function StackedSections({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    // On reduced motion, panels just flow normally.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Desktop only — on tablet/mobile the pin/cover fights touch scrolling,
    // so panels just flow as normal stacked cards there.
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const ctx = gsap.context(() => {
        const panels = gsap.utils.toArray<HTMLElement>(".stack-panel", root);

        const heroStage =
          document.querySelector<HTMLElement>(".hero-stage");

        panels.forEach((panel, i) => {
          // later panels paint over earlier ones as they rise
          panel.style.zIndex = String(i + 1);

          if (i === 0) {
            // First panel rises over the hero. The hero has its own pin, so we
            // don't pin it again — we just push it back slightly (scale only,
            // NEVER opacity: fading a covered panel reveals the stack behind it)
            // as About climbs over it.
            if (heroStage) {
              gsap.fromTo(
                heroStage,
                { scale: 1 },
                {
                  scale: 0.96,
                  ease: "none",
                  transformOrigin: "50% 45%",
                  scrollTrigger: {
                    trigger: panel,
                    start: "top bottom",
                    end: "top top",
                    scrub: true,
                  },
                }
              );
            }
            return;
          }

          const prev = panels[i - 1];

          // Hold the previous card fixed while this one slides up over it, and
          // push it back slightly (scale only — opacity would make it
          // see-through and expose the whole pinned stack).
          gsap.fromTo(
            prev,
            { scale: 1 },
            {
              scale: 0.96,
              ease: "none",
              transformOrigin: "50% 45%",
              scrollTrigger: {
                trigger: panel,
                start: "top bottom",
                end: "top top",
                scrub: true,
                pin: prev,
                pinSpacing: false,
              },
            }
          );
        });
      }, root);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return <div ref={rootRef}>{children}</div>;
}
