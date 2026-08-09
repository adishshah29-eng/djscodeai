"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Preloader() {
  const [phase, setPhase] = useState<"visible" | "fading" | "gone">("visible");

  useEffect(() => {
    // Start fade-out after logo has been shown
    const fadeTimer = setTimeout(() => setPhase("fading"), 1800);
    // Remove from DOM after fade completes
    const goneTimer = setTimeout(() => setPhase("gone"), 2500);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(goneTimer);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      aria-hidden="true"
      className="preloader-overlay"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0B0907",
        transition: "opacity 0.7s ease",
        opacity: phase === "fading" ? 0 : 1,
        pointerEvents: phase === "fading" ? "none" : "auto",
      }}
    >
      {/* Logo */}
      <div
        style={{
          animation: "preloader-pop 0.6s cubic-bezier(0.34,1.56,0.64,1) both",
          animationDelay: "0.1s",
        }}
      >
        <Image
          src="/7.png"
          alt="DJS CodeAI"
          width={260}
          height={100}
          priority
          style={{ objectFit: "contain", filter: "brightness(1.2) contrast(1.1)" }}
        />
      </div>

      {/* Tagline */}
      <p
        style={{
          marginTop: "1.5rem",
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: "0.7rem",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "var(--muted)",
          animation: "preloader-fade 0.5s ease both",
          animationDelay: "0.55s",
        }}
      >
        Learn · Create · Innovate
      </p>

      {/* Progress bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: "var(--glass-border)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            background:
              "linear-gradient(90deg, var(--chrome-lo), var(--chrome-mid), var(--chrome-hi), var(--chrome-mid), var(--chrome-lo))",
            animation: "preloader-bar 1.6s ease-in-out forwards",
          }}
        />
      </div>

      <style>{`
        @keyframes preloader-pop {
          0%   { opacity: 0; transform: scale(0.82) translateY(12px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes preloader-fade {
          0%   { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes preloader-bar {
          0%   { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
