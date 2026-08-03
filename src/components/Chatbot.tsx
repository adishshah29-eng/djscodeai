"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from "react";

// ─── Q&A data ────────────────────────────────────────────────────────────
type QA = {
  id: string;
  question: string;
  answer: ReactNode;
  followUps?: string[];
};

const QA: QA[] = [
  {
    id: "what",
    question: "What is DJS CodeAI?",
    answer: (
      <>
        We&apos;re the <strong className="text-chrome-hi">AI &amp; ML club</strong>{" "}
        of DJ Sanghvi College of Engineering, Mumbai — a student-led community
        exploring the frontiers of artificial intelligence through hands-on
        projects, hackathons, and mentorship.
      </>
    ),
    followUps: ["join", "events", "team"],
  },
  {
    id: "join",
    question: "How can I join the club?",
    answer: (
      <>
        We recruit at the start of each academic year through auditions and a
        mentor-mentee application. Follow{" "}
        <a
          href="https://instagram.com/djs_codeai"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline underline-offset-2"
        >
          @djs_codeai on Instagram
        </a>{" "}
        for the next recruitment call.
      </>
    ),
    followUps: ["what", "events", "contact"],
  },
  {
    id: "events",
    question: "What events do you organize?",
    answer: (
      <>
        Our flagship is <strong className="text-chrome-hi">CodeVerse 1.0</strong>{" "}
        (Nov 8, 2025 — registration open). We also run CODEQUEST hackathons,
        the &ldquo;Roadmap to Becoming an AI Engineer&rdquo; seminar, and the{" "}
        &ldquo;AI for Good&rdquo; hackathon.
      </>
    ),
    followUps: ["projects", "join", "contact"],
  },
  {
    id: "projects",
    question: "What projects are you working on?",
    answer: (
      <>
        Currently: <strong className="text-chrome-hi">Deep Generative Models</strong>{" "}
        (GANs / VAEs / Diffusion in PyTorch), FinteX financial analysis, a
        voice-driven multi-agent finance assistant, MindCompanion mental-health
        AI, ACAF affective analysis, and paper reproductions.
      </>
    ),
    followUps: ["tech", "join", "team"],
  },
  {
    id: "team",
    question: "Who leads the club?",
    answer: (
      <>
        <strong className="text-chrome-hi">Krishil Parikh</strong> (President),
        Krisha Maisheri (VP), Rishee Panchal (Secretary), Deep Mehta (Admin).
        Faculty guidance from Dr. Aruna Gawade (HOD, AI&amp;ML). The full team
        of 17 is on the Team page.
      </>
    ),
    followUps: ["what", "join", "contact"],
  },
  {
    id: "tech",
    question: "What technologies do you use?",
    answer: (
      <>
        <strong className="text-chrome-hi">PyTorch</strong>, TensorFlow, Python,
        Deep Learning, NLP, Generative AI, LLMs, multi-agent frameworks, and
        full-stack for AI-integrated products.
      </>
    ),
    followUps: ["projects", "events", "join"],
  },
  {
    id: "contact",
    question: "How do I contact the club?",
    answer: (
      <>
        Email us at{" "}
        <a
          href="mailto:contact.djscodeai@gmail.com"
          className="text-accent underline underline-offset-2"
        >
          contact.djscodeai@gmail.com
        </a>{" "}
        or call{" "}
        <a
          href="tel:+918104665118"
          className="text-accent underline underline-offset-2"
        >
          +91 8104665118
        </a>
        . We&apos;re on the 4th Floor, AIML Department, DJ Sanghvi College.
      </>
    ),
    followUps: ["join", "events", "what"],
  },
];

const QA_BY_ID = Object.fromEntries(QA.map((q) => [q.id, q]));

type Message =
  | { kind: "bot"; content: ReactNode; suggestions?: string[] }
  | { kind: "user"; content: string }
  | { kind: "typing" };

const INITIAL_MESSAGES: Message[] = [
  {
    kind: "bot",
    content: (
      <>
        Hey <span className="text-accent">👋</span> I&apos;m the DJS CodeAI
        assistant. What would you like to know?
      </>
    ),
    suggestions: ["what", "join", "events", "projects"],
  },
];

// ─── Chatbot ─────────────────────────────────────────────────────────────
export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [pulseHint, setPulseHint] = useState(true);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // hide the initial FAB pulse after a while
  useEffect(() => {
    const t = setTimeout(() => setPulseHint(false), 8000);
    return () => clearTimeout(t);
  }, []);

  // scroll to bottom on new message
  useEffect(() => {
    scrollerRef.current?.scrollTo({
      top: scrollerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, open]);

  // lock body scroll + wire ESC to close
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    // focus the close button for keyboard users
    closeBtnRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const askById = useCallback((id: string) => {
    const qa = QA_BY_ID[id];
    if (!qa) return;

    // user bubble
    setMessages((prev) => [
      ...prev,
      { kind: "user", content: qa.question },
      { kind: "typing" },
    ]);

    // simulated typing delay → replace typing with actual answer
    window.setTimeout(() => {
      setMessages((prev) => {
        const next = prev.filter((m) => m.kind !== "typing");
        return [
          ...next,
          {
            kind: "bot",
            content: qa.answer,
            suggestions: qa.followUps,
          },
        ];
      });
    }, 650);
  }, []);

  const reset = useCallback(() => setMessages(INITIAL_MESSAGES), []);

  return (
    <>
      {/* ─── Floating action button ─── */}
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setPulseHint(false);
        }}
        aria-label="Open chat assistant"
        aria-expanded={open}
        aria-controls="djs-chatbot-panel"
        className="chatbot-fab fixed bottom-6 right-6 z-[120] group"
      >
        <span
          className={`absolute inset-0 rounded-full bg-accent/30 ${
            pulseHint && !open ? "animate-ping" : ""
          }`}
        />
        <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-obsidian-2 border border-accent/40 text-accent shadow-[0_0_24px_rgba(79,230,255,0.25)] transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
          {open ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.87 9.87 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          )}
        </span>
      </button>

      {/* ─── Modal ─── */}
      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-[110] transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop with blur */}
        <div
          onClick={() => setOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Panel */}
        <div
          id="djs-chatbot-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="chatbot-title"
          className={`absolute right-0 top-0 bottom-0 w-full sm:w-[440px] flex flex-col bg-obsidian-2 border-l border-glass-border shadow-2xl transition-transform duration-500 ease-out ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-glass-border">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-full bg-obsidian-3 border border-accent/30 flex items-center justify-center">
                <span
                  className="chrome-text-animated display-heading text-xs"
                  aria-hidden="true"
                >
                  AI
                </span>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-accent border-2 border-obsidian-2" />
              </div>
              <div>
                <p
                  id="chatbot-title"
                  className="text-chrome-hi text-sm font-medium"
                >
                  DJS CodeAI Assistant
                </p>
                <p
                  className="text-muted text-[10px] tracking-wider uppercase"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Online · typically instant
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={reset}
                aria-label="Reset conversation"
                className="w-9 h-9 rounded-full text-muted hover:text-chrome-hi hover:bg-obsidian-3 transition-colors flex items-center justify-center"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4v6h6M20 20v-6h-6M20 4a9 9 0 00-15.5 3M4 20a9 9 0 0015.5-3"
                  />
                </svg>
              </button>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="w-9 h-9 rounded-full text-muted hover:text-chrome-hi hover:bg-obsidian-3 transition-colors flex items-center justify-center"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollerRef}
            className="flex-1 overflow-y-auto px-5 py-6 space-y-4"
          >
            {messages.map((m, i) => {
              if (m.kind === "user") {
                return (
                  <div key={i} className="flex justify-end">
                    <div className="max-w-[85%] px-4 py-2.5 rounded-2xl rounded-tr-md bg-accent/15 border border-accent/25 text-chrome-hi text-sm">
                      {m.content}
                    </div>
                  </div>
                );
              }
              if (m.kind === "typing") {
                return (
                  <div key={i} className="flex justify-start">
                    <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-obsidian-3 border border-glass-border flex items-center gap-1.5">
                      <TypingDot delay="0ms" />
                      <TypingDot delay="150ms" />
                      <TypingDot delay="300ms" />
                    </div>
                  </div>
                );
              }
              // bot message
              return (
                <div key={i} className="flex flex-col gap-3 items-start">
                  <div className="max-w-[92%] px-4 py-3 rounded-2xl rounded-tl-md bg-obsidian-3 border border-glass-border text-silver text-sm leading-relaxed">
                    {m.content}
                  </div>
                  {m.suggestions && m.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {m.suggestions.map((sid) => {
                        const q = QA_BY_ID[sid];
                        if (!q) return null;
                        return (
                          <button
                            key={sid}
                            onClick={() => askById(sid)}
                            className="px-3 py-1.5 rounded-full text-xs text-accent border border-accent/25 bg-accent/5 hover:bg-accent/15 hover:border-accent/40 transition-all duration-200"
                          >
                            {q.question}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer — persistent suggestion strip */}
          <div className="px-5 py-4 border-t border-glass-border">
            <p
              className="text-muted text-[10px] tracking-wider uppercase mb-3"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Ask about
            </p>
            <div className="flex flex-wrap gap-2">
              {QA.map((q) => (
                <button
                  key={q.id}
                  onClick={() => askById(q.id)}
                  className="px-3 py-1.5 rounded-full text-xs text-muted border border-glass-border hover:text-chrome-hi hover:border-chrome-lo transition-all duration-200"
                >
                  {q.question}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function TypingDot({ delay }: { delay: string }) {
  return (
    <span
      className="w-1.5 h-1.5 rounded-full bg-chrome-mid animate-bounce"
      style={{ animationDelay: delay }}
    />
  );
}
