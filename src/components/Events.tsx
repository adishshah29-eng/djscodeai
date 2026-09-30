"use client";

import { useState } from "react";
import Reveal from "./Reveal";

type EventStatus = "open" | "closed" | "save-the-date";
type EventSection = "upcoming" | "past";

interface EventMoment {
  image: string;
  caption: string;
}

interface EventItem {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  status: EventStatus;
  section: EventSection;
  link?: string;
  // Only used for past events — a handful of photo + caption
  // cards shown in the expanded "Past Events" body.
  moments?: EventMoment[];
}

// ============================================================
// EVENTS — single source of truth
// To move an event between sections, just change its `section`
// field ("upcoming" <-> "past"). No need to cut/paste between
// arrays anymore.
// ============================================================
const EVENTS: EventItem[] = [
  {
    title: "Neurovate 2.0",
    date: "AUG 12, 2026",
    time: "2:00PM - 4:00PM",
    location: "DJSCE Campus",
    description:
      "CodeAI walked students through an overview of machine learning and web development, showcasing past projects and events. The session wrapped up with an engaging Q&A.",
    status: "open",
    section: "past",
    moments: [
      {
        image: "/Events/neurovate2.0/m1.jpeg",
        caption: "Kicked off with an overview of ML and web development.\nWalked through past projects built by the club.",
      },
      {
        image: "/Events/neurovate2.0/m2.jpeg",
        caption: "A packed room tuned in from the start.\nQuestions and curiosity kept the session going.",
      },
      {
        image: "/Events/neurovate2.0/m3.jpeg",
        caption: "The full house settled in for the presentation.\nCovered a look back at what CodeAI has done so far.",
      },
      {
        image: "/Events/neurovate2.0/m4.jpeg",
        caption: "Wrapped up the session with everyone together.\nA great way to close out the event on a high note.",
      },
    ],
  },
  {
    title: "CodeVerse 1.0",
    date: "NOV 08, 2025",
    time: "8:00 AM — 6:00 PM",
    location: "4th Floor, AIML Department",
    description:
      "Revive the System, Redefine Intelligence — an offline flagship AI challenge where participants tackle real-world debugging and data-driven problem-solving tasks.",
    status: "closed",
    section: "past",
    moments: [
      {
        image: "",
        caption: "Teams deep in debugging during round two.",
      },
      {
        image: "",
        caption: "The winning team presenting their fix.",
      },
      {
        image: "",
        caption: "A packed house on the 4th floor, AIML department.",
      },
    ],
  },
  {
    title: "CODEQUEST 2025",
    date: "OCT 05–12, 2025",
    time: "Stage-wise format",
    location: "Hybrid",
    description:
      "A hybrid hackathon designed to introduce juniors to the full hackathon experience with mentorship, pitching, and teamwork across multiple stages.",
    status: "closed",
    section: "past",
    moments: [
      {
        image: "",
        caption: "Juniors pitching their first hackathon idea.",
      },
      {
        image: "",
        caption: "Mentors walking through feedback between stages.",
      },
    ],
  },
  {
    title: "Roadmap to AI Engineer",
    date: "AUG 05, 2025",
    time: "11:00 AM — 1:00 PM",
    location: "Seminar Hall",
    description:
      "An exclusive seminar to ignite your path to becoming a cutting-edge AI Engineer, guided by expert mentors from DJS CodeAI.",
    status: "closed",
    section: "past",
    moments: [
      {
        image: "",
        caption: "Mentors from DJS CodeAI opening the seminar.",
      },
      {
        image: "",
        caption: "Q&A on breaking into AI engineering roles.",
      },
    ],
  },
  {
    title: "Hackathon: AI for Good",
    date: "JUN 01–03, 2025",
    time: "48 Hours",
    location: "Innovation Center",
    description:
      "A 48-hour hackathon focused on developing AI solutions for social impact and sustainability challenges.",
    status: "closed",
    section: "past",
  },
];

function StatusBadge({ status }: { status: EventStatus }) {
  switch (status) {
    case "open":
      return (
        <span
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-medium tracking-widest uppercase bg-accent/15 text-accent border border-accent/30 glow-pulse"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          Registrations Open
        </span>
      );

    case "save-the-date":
      return (
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-medium tracking-widest uppercase bg-chrome-lo/20 text-chrome-mid border border-chrome-lo/30"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Save the Date
        </span>
      );

    case "closed":
    default:
      return (
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-medium tracking-widest uppercase bg-obsidian-3 text-muted border border-glass-border"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Closed
        </span>
      );
  }
}

export default function Events() {
  const [expandedUpcoming, setExpandedUpcoming] = useState<number | null>(0);
  const [expandedPast, setExpandedPast] = useState<number | null>(null);

  // Derive the two lists from the single tagged EVENTS array.
  const upcomingEvents = EVENTS.filter((event) => event.section === "upcoming");
  const pastEvents = EVENTS.filter((event) => event.section === "past");

  return (
    <section id="events" className="section-padding relative">
      <div className="mx-auto max-w-5xl">

        {/* SECTION HEADER */}
        <Reveal>
          <p className="section-label">( Events )</p>

          <h2 className="section-heading mb-6">
            What&apos;s Happening
          </h2>

          <div className="mb-16">
            <p className="section-subtext max-w-2xl m-0">
              Hackathons, seminars, and workshops — building skills through
              experience.
            </p>
          </div>
        </Reveal>


        {/* ========================================================= */}
        {/* UPCOMING EVENTS */}
        {/* ========================================================= */}

        <Reveal>
          <div className="mb-20">

            {/* Upcoming Heading */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">

              <div>
                <p className="section-label mb-2">( Upcoming )</p>

                <h3 className="display-heading text-3xl md:text-4xl text-chrome-hi">
                  Upcoming Events
                </h3>
              </div>

              {/* Year Dropdown */}
              <select
                className="bg-obsidian-2 border border-glass-border rounded-lg px-4 py-2.5 text-sm text-chrome-mid focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 cursor-pointer appearance-none shrink-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23C3C7D4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 12px center",
                  backgroundSize: "16px",
                  paddingRight: "40px",
                }}
                value="2026"
                onChange={() => {}}
              >
                <option value="2026">2026</option>
              </select>

            </div>


            {/* Upcoming Event List */}
            <div className="border-t border-glass-border">

              {upcomingEvents.map((event, index) => {

                const isExpanded = expandedUpcoming === index;

                return (
                  <div
                    key={event.title}
                    className="border-b border-glass-border group"
                  >

                    {/* Event Header */}
                    <button
                      onClick={() =>
                        setExpandedUpcoming(
                          isExpanded ? null : index
                        )
                      }
                      className="w-full text-left py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors duration-300 outline-none focus-visible:bg-white/[0.04]"
                      aria-expanded={isExpanded}
                    >

                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8 lg:gap-16 w-full px-4 md:px-0">

                        <span
                          className={`font-mono text-xs tracking-wider shrink-0 w-32 transition-colors duration-300 ${
                            isExpanded
                              ? "text-accent"
                              : "text-muted group-hover:text-chrome-mid"
                          }`}
                        >
                          {event.date}
                        </span>

                        <h3
                          className={`display-heading text-xl md:text-2xl lg:text-3xl transition-all duration-300 ${
                            isExpanded
                              ? "text-chrome-hi translate-x-2"
                              : "text-chrome-mid group-hover:text-chrome-hi"
                          }`}
                        >
                          {event.title}
                        </h3>

                      </div>


                      <div className="shrink-0 px-4 md:px-0 mt-2 md:mt-0 flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">

                        <StatusBadge status={event.status} />

                        {/* Chevron */}
                        <svg
                          className={`w-5 h-5 text-muted transition-transform duration-500 hidden md:block ${
                            isExpanded
                              ? "rotate-180 text-chrome-hi"
                              : "group-hover:text-chrome-hi"
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>

                      </div>

                    </button>


                    {/* Expanded Body */}
                    <div
                      className={`grid transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                        isExpanded
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >

                      <div className="overflow-hidden">

                        <div className="pb-8 pt-2 flex flex-col md:flex-row gap-8 lg:gap-16 px-4 md:px-0">

                          {/* Alignment Spacer */}
                          <div className="hidden md:block w-32 shrink-0" />

                          <div className="flex-1 md:pl-2">

                            {/* Time + Location */}
                            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-xs font-mono text-muted mb-6">

                              <span className="flex items-center gap-2">

                                <svg
                                  className="w-3.5 h-3.5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={1.5}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>

                                {event.time}

                              </span>


                              <span className="flex items-center gap-2">

                                <svg
                                  className="w-3.5 h-3.5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={1.5}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>

                                {event.location}

                              </span>

                            </div>


                            {/* Description */}
                            <p className="text-chrome-mid/80 max-w-2xl leading-relaxed text-sm md:text-base">
                              {event.description}
                            </p>


                            {/* Register Button */}
                            {event.status === "open" && event.link && (
                              <div className="mt-8">

                                <a
                                  href={event.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-full bg-accent/10 border border-accent/30 text-accent text-sm font-medium transition-all duration-300 hover:bg-accent/20 hover:shadow-[0_0_24px_rgba(238,240,246,0.15)] focus:outline-none focus:ring-2 focus:ring-accent/50"
                                >
                                  Register Now

                                  <svg
                                    className="w-3.5 h-3.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                                    />
                                  </svg>

                                </a>

                              </div>
                            )}

                          </div>

                        </div>

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>
          </div>
        </Reveal>


        {/* ========================================================= */}
        {/* PAST EVENTS */}
        {/* ========================================================= */}

        <Reveal>
          <div>

            {/* Past Heading */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">

              <div>
                <p className="section-label mb-2">( Archive )</p>

                <h3 className="display-heading text-3xl md:text-4xl text-chrome-hi">
                  Past Events
                </h3>
              </div>


              {/* Year Dropdown */}
              <select
                className="bg-obsidian-2 border border-glass-border rounded-lg px-4 py-2.5 text-sm text-chrome-mid focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 cursor-pointer appearance-none shrink-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23C3C7D4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 12px center",
                  backgroundSize: "16px",
                  paddingRight: "40px",
                }}
                value="2025"
                onChange={() => {}}
              >
                <option value="2025">2025</option>
              </select>

            </div>


            {/* Past Event List */}
            <div className="border-t border-glass-border">

              {pastEvents.map((event, index) => {

                const isExpanded = expandedPast === index;

                return (
                  <div
                    key={event.title}
                    className="border-b border-glass-border group"
                  >

                    {/* Event Header */}
                    <button
                      onClick={() =>
                        setExpandedPast(
                          isExpanded ? null : index
                        )
                      }
                      className="w-full text-left py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors duration-300 outline-none focus-visible:bg-white/[0.04]"
                      aria-expanded={isExpanded}
                    >

                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8 lg:gap-16 w-full px-4 md:px-0">

                        <span
                          className={`font-mono text-xs tracking-wider shrink-0 w-32 transition-colors duration-300 ${
                            isExpanded
                              ? "text-accent"
                              : "text-muted group-hover:text-chrome-mid"
                          }`}
                        >
                          {event.date}
                        </span>

                        <h3
                          className={`display-heading text-xl md:text-2xl lg:text-3xl transition-all duration-300 ${
                            isExpanded
                              ? "text-chrome-hi translate-x-2"
                              : "text-chrome-mid group-hover:text-chrome-hi"
                          }`}
                        >
                          {event.title}
                        </h3>

                      </div>


                      <div className="shrink-0 px-4 md:px-0 mt-2 md:mt-0 flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">

                        <StatusBadge status={event.status} />

                        {/* Chevron */}
                        <svg
                          className={`w-5 h-5 text-muted transition-transform duration-500 hidden md:block ${
                            isExpanded
                              ? "rotate-180 text-chrome-hi"
                              : "group-hover:text-chrome-hi"
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>

                      </div>

                    </button>


                    {/* Expanded Body */}
                    <div
                      className={`grid transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                        isExpanded
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >

                      <div className="overflow-hidden">

                        <div className="pb-8 pt-2 px-4 md:px-0">

                          <div className="flex flex-col md:flex-row gap-8 lg:gap-16">

                            <div className="hidden md:block w-32 shrink-0" />

                            <div className="flex-1 md:pl-2">

                              {/* Time + Location */}
                              <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-xs font-mono text-muted mb-6">

                                <span className="flex items-center gap-2">

                                  <svg
                                    className="w-3.5 h-3.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={1.5}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>

                                  {event.time}

                                </span>


                                <span className="flex items-center gap-2">

                                  <svg
                                    className="w-3.5 h-3.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={1.5}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                  </svg>

                                  {event.location}

                                </span>

                              </div>


                              {/* Description */}
                              <p className="text-chrome-mid/80 max-w-2xl leading-relaxed text-sm md:text-base">
                                {event.description}
                              </p>

                            </div>

                          </div>


                          {/* Moments — square photo cards, 2 per row */}
                          {event.moments && event.moments.length > 0 && (
                            <div className="grid grid-cols-2 gap-4 mt-8">

                              {event.moments.map((moment, momentIndex) => (
                                <div
                                  key={momentIndex}
                                  className="relative aspect-[4/3] rounded-xl border border-glass-border bg-obsidian-2/40 overflow-hidden"
                                >

                                  {/* Photo — fills the square, placeholder if not uploaded yet */}
                                  {moment.image ? (
                                    <img
                                      src={moment.image}
                                      alt={moment.caption}
                                      className="absolute inset-0 w-full h-full object-cover object-top"
                                      loading="lazy"
                                    />
                                  ) : (
                                    <div className="absolute inset-0 border border-dashed border-glass-border bg-obsidian-3 flex items-center justify-center text-muted text-xs font-mono">
                                      No photo yet
                                    </div>
                                  )}

                                  {/* Caption — overlaid on a dark gradient at the bottom */}
                                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-4 pt-10 pb-4">
                                    <p className="text-chrome-hi/90 text-xs md:text-sm leading-snug">
                                      {moment.caption}
                                    </p>
                                  </div>

                                </div>
                              ))}

                            </div>
                          )}

                        </div>

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
