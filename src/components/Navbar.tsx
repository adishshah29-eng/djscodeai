"use client";

import { useState, useEffect, useCallback } from "react";

const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Team", href: "#team" },
  { label: "Projects", href: "#projects" },
  { label: "Events", href: "#events" },
  { label: "Contact", href: "#contact" },
] as const;

export default function Navbar() {
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 40);

    const sections = NAV_ITEMS.map((item) => item.href.slice(1));
    for (let i = sections.length - 1; i >= 0; i--) {
      const el = document.getElementById(sections[i]);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 120) {
          setActive(sections[i]);
          break;
        }
      }
    }
  }, []);

  // rAF-throttled: reading layout on every scroll event thrashes the main thread
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        handleScroll();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled
          ? "bg-obsidian/80 backdrop-blur-xl border-b border-glass-border"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <a
          href="#home"
          className="flex items-center gap-3 group"
          onClick={() => setMenuOpen(false)}
        >
          <span className="chrome-text-animated display-heading text-lg md:text-xl tracking-tight">
            DJS CodeAI
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                active === item.href.slice(1)
                  ? "text-accent"
                  : "text-muted hover:text-chrome-hi"
              }`}
            >
              {item.label}
              {active === item.href.slice(1) && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-accent rounded-full" />
              )}
            </a>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden relative w-10 h-10 flex items-center justify-center"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span
            className={`absolute w-5 h-[1.5px] bg-chrome-mid transition-all duration-300 ${
              menuOpen ? "rotate-45 translate-y-0" : "-translate-y-1.5"
            }`}
          />
          <span
            className={`absolute w-5 h-[1.5px] bg-chrome-mid transition-all duration-300 ${
              menuOpen ? "opacity-0 scale-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute w-5 h-[1.5px] bg-chrome-mid transition-all duration-300 ${
              menuOpen ? "-rotate-45 translate-y-0" : "translate-y-1.5"
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden fixed inset-0 top-16 bg-obsidian/95 backdrop-blur-2xl transition-all duration-500 ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {NAV_ITEMS.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`display-heading text-3xl transition-all duration-500 ${
                active === item.href.slice(1)
                  ? "chrome-text-animated"
                  : "text-muted hover:text-chrome-hi"
              }`}
              style={{
                transitionDelay: menuOpen ? `${i * 60}ms` : "0ms",
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen
                  ? "translateY(0)"
                  : "translateY(20px)",
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
