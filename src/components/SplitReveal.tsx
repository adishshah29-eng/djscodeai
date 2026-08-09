"use client";

import { useRef, useEffect, useLayoutEffect, type ElementType, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const useIso =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Constrained to tags that accept className + children — otherwise
// ElementType's children prop collapses to `never` for elements like <input>.
type ContainerTag = ElementType<{
  className?: string;
  children?: ReactNode;
}>;

type Props = {
  children: string;
  as?: ContainerTag;
  className?: string;
  /** ScrollTrigger start position */
  start?: string;
  /** stagger between words, seconds */
  stagger?: number;
};

/**
 * Splits text into words and animates each one in (rise + fade + slight
 * blur-clear) as it scrolls into view — makes headings feel like they're
 * arriving rather than just appearing.
 *
 * The scroll ref lives on a `display:contents` wrapper (not on `Tag` itself)
 * so the polymorphic tag never needs a forwarded ref — sidesteps TS's
 * union-type blowup with generic ElementType + ref.
 */
export default function SplitReveal({
  children,
  as: Tag = "div",
  className,
  start = "top 88%",
  stagger = 0.05,
}: Props) {
  const wrapRef = useRef<HTMLSpanElement>(null);

  useIso(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    gsap.registerPlugin(ScrollTrigger);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const words = wrap.querySelectorAll<HTMLElement>("[data-word]");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { opacity: 0, y: "0.6em", filter: "blur(6px)" },
        {
          opacity: 1,
          y: "0em",
          filter: "blur(0px)",
          duration: 0.7,
          ease: "power3.out",
          stagger,
          scrollTrigger: {
            trigger: wrap,
            start,
            once: true,
          },
        }
      );
    }, wrapRef);

    return () => ctx.revert();
  }, [start, stagger]);

  const words = children.split(" ");

  return (
    <span ref={wrapRef} style={{ display: "contents" }}>
      <Tag className={className}>
        {words.map((w, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.1em]">
            <span data-word className="inline-block will-change-transform">
              {w}
              {i < words.length - 1 ? " " : ""}
            </span>
          </span>
        ))}
      </Tag>
    </span>
  );
}
