import Reveal from "./Reveal";

export default function About() {
  return (
    <section id="about" className="section-padding relative">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          {/* Section label */}
          <p className="label-caps mb-4 text-accent">About Us</p>

          {/* Vision statement — big and confident */}
          <h2 className="display-heading text-3xl md:text-5xl lg:text-6xl chrome-text mb-8 max-w-4xl">
            A Community Dedicated to the Frontiers of Intelligence
          </h2>
          <p className="text-muted text-lg md:text-xl max-w-2xl mb-20 leading-relaxed">
            <strong className="text-chrome-mid font-medium">DJS CodeAI</strong>{" "}
            is the AI &amp; ML club of{" "}
            <strong className="text-chrome-mid font-medium">
              DJ Sanghvi College of Engineering, Mumbai
            </strong>{" "}
            — a student-led community exploring the frontiers of artificial
            intelligence and coding, bringing together passionate individuals
            to learn, create, and innovate.
          </p>
        </Reveal>

        {/* Three pillars on a thin grid */}
        <Reveal
          stagger={0.12}
          className="grid md:grid-cols-3 gap-px bg-glass-border rounded-2xl overflow-hidden mb-20"
        >
          {PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="bg-obsidian-2 p-8 md:p-10 group hover:bg-obsidian-3 transition-colors duration-500"
            >
              <div className="text-3xl mb-5 opacity-70 group-hover:opacity-100 transition-opacity">
                {pillar.icon}
              </div>
              <h3 className="display-heading text-lg text-chrome-hi mb-3">
                {pillar.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </Reveal>

        {/* Mentor-Mentee card with silver vein */}
        <Reveal className="relative glass-card rounded-2xl p-8 md:p-12 overflow-hidden">
          {/* Silver vein connection */}
          <div className="absolute left-1/2 top-8 bottom-8 w-px bg-gradient-to-b from-transparent via-chrome-mid/30 to-transparent hidden md:block" />

          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            {/* Mentor side */}
            <div className="text-center md:text-right">
              <span className="label-caps text-accent mb-3 inline-block">
                Mentor
              </span>
              <h3 className="display-heading text-2xl md:text-3xl chrome-text mb-4">
                Guide
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                Experienced members share domain expertise through structured
                sessions, code reviews, and project mentorship — bridging the
                gap between theory and industry practice.
              </p>
            </div>

            {/* Mentee side */}
            <div className="text-center md:text-left">
              <span className="label-caps text-accent mb-3 inline-block">
                Mentee
              </span>
              <h3 className="display-heading text-2xl md:text-3xl chrome-text mb-4">
                Build
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                Dedicated learners gain hands-on experience through real-world
                projects, workshops, and close interaction with mentors —
                building industry-ready skills from day one.
              </p>
            </div>
          </div>

          {/* Connection node */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-chrome-lo items-center justify-center bg-obsidian-2">
            <div className="w-2 h-2 rounded-full bg-accent/60" />
          </div>
        </Reveal>

        {/* Vision statement */}
        <Reveal className="mt-20 text-center max-w-3xl mx-auto">
          <blockquote className="text-chrome-mid text-lg md:text-xl italic leading-relaxed">
            &ldquo;To create a dedicated community that fosters innovation,
            collaboration, and hands-on learning in Machine Learning — bridging
            the gap between theoretical understanding and practical application
            through real-world projects and mentorship.&rdquo;
          </blockquote>
          <p className="label-caps mt-6">Our Vision</p>
        </Reveal>
      </div>
    </section>
  );
}

const PILLARS = [
  {
    icon: "01",
    title: "Practical Application",
    description:
      "Transform theoretical knowledge into working systems through hands-on projects spanning computer vision, NLP, generative models, and reinforcement learning.",
  },
  {
    icon: "02",
    title: "Industry-Ready Skills",
    description:
      "Build production-grade skills in model deployment, MLOps, data engineering, and system design through collaborative projects and workshops.",
  },
  {
    icon: "03",
    title: "Research & Development",
    description:
      "Implement cutting-edge papers, develop novel solutions, and contribute to open-source AI research alongside a driven peer community.",
  },
] as const;
