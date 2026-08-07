import Reveal from "./Reveal";
import TimelineLine from "./TimelineLine";

type EventStatus = "open" | "closed" | "save-the-date";

interface EventItem {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  status: EventStatus;
}

const EVENTS: EventItem[] = [
  {
    title: "CodeVerse 1.0",
    date: "November 8, 2025",
    time: "8:00 AM — 6:00 PM",
    location: "4th Floor, AIML Department",
    description:
      "Revive the System, Redefine Intelligence — an offline flagship AI challenge where participants tackle real-world debugging and data-driven problem-solving tasks.",
    status: "open",
  },
  {
    title: "CODEQUEST 2025",
    date: "October 5–12, 2025",
    time: "Stage-wise format",
    location: "Hybrid",
    description:
      "A hybrid hackathon designed to introduce juniors to the full hackathon experience with mentorship, pitching, and teamwork across multiple stages.",
    status: "closed",
  },
  {
    title: "Roadmap to Becoming an AI Engineer",
    date: "August 5, 2025",
    time: "11:00 AM — 1:00 PM",
    location: "Seminar Hall",
    description:
      "An exclusive seminar to ignite your path to becoming a cutting-edge AI Engineer, guided by expert mentors from DJS CodeAI.",
    status: "closed",
  },
  {
    title: "Hackathon: AI for Good",
    date: "June 1–3, 2025",
    time: "48 Hours",
    location: "Innovation Center",
    description:
      "A 48-hour hackathon focused on developing AI solutions for social impact and sustainability challenges.",
    status: "save-the-date",
  },
];

function StatusBadge({ status }: { status: EventStatus }) {
  switch (status) {
    case "open":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase bg-accent/15 text-accent border border-accent/30 glow-pulse"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          Registration Open
        </span>
      );
    case "closed":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase bg-obsidian-3 text-muted border border-glass-border"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Registration Closed
        </span>
      );
    case "save-the-date":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase bg-transparent text-chrome-mid border border-chrome-lo"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Save the Date
        </span>
      );
  }
}

export default function Events() {
  return (
    <section id="events" className="section-padding relative">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <p className="label-caps mb-4 text-accent">Events</p>
          <h2 className="display-heading text-3xl md:text-5xl chrome-text mb-6">
            What&apos;s Happening
          </h2>
          <p className="text-muted text-lg max-w-2xl mb-16">
            Hackathons, seminars, and workshops — building skills through
            experience.
          </p>
        </Reveal>

        {/* Vertical timeline */}
        <div className="relative">
          {/* Timeline line — draws downward as you scroll */}
          <TimelineLine />

          <Reveal stagger={0.15} className="space-y-12">
            {EVENTS.map((event) => (
              <div key={event.title} className="relative pl-12 md:pl-20">
                {/* Timeline dot */}
                <div
                  className={`absolute left-2.5 md:left-6.5 top-2 w-3 h-3 rounded-full border-2 ${
                    event.status === "open"
                      ? "border-accent bg-accent/30"
                      : "border-chrome-lo bg-obsidian-2"
                  }`}
                />

                <div
                  className={`glass-card rounded-2xl p-6 md:p-8 transition-all duration-500 ${
                    event.status === "open"
                      ? "border-accent/20 hover:border-accent/40"
                      : "hover:border-chrome-lo/30"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="display-heading text-xl md:text-2xl text-chrome-hi mb-2">
                        {event.title}
                      </h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted" style={{ fontFamily: "var(--font-mono)" }}>
                        <span>{event.date}</span>
                        <span>{event.time}</span>
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <StatusBadge status={event.status} />
                  </div>

                  <p className="text-muted text-sm leading-relaxed">
                    {event.description}
                  </p>

                  {event.status === "open" && (
                    <a
                      href="#contact"
                      className="inline-flex items-center gap-2 mt-6 px-6 py-2.5 rounded-full bg-accent/10 border border-accent/30 text-accent text-sm transition-all duration-300 hover:bg-accent/20 hover:shadow-[0_0_20px_rgba(238,240,246,0.12)]"
                    >
                      Register Now
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
