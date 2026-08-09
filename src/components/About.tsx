import Reveal from "./Reveal";
import SplitReveal from "./SplitReveal";

const PRINCIPLES = [
  ["01", "Learn by building", "Theory only sticks once you ship it."],
  ["02", "Ship real work", "Products that run — not slides that impress."],
  ["03", "Reach further", "The gap between hand and mind is the whole point."],
] as const;

export default function About() {
  return (
    <section id="about" className="section-padding relative">
      <div className="mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 items-center">
          <Reveal className="text-left">
            <p className="section-label">( About )</p>
            <h2 className="section-heading mb-8">
              We build more than just models.
            </h2>
            <p className="section-subtext max-w-xl">
              <strong className="text-chrome-hi font-medium">DJS CodeAI</strong> is
              the AI &amp; ML club of{" "}
              <strong className="text-chrome-hi font-medium">
                DJ Sanghvi College of Engineering, Mumbai
              </strong>{" "}
              — we learn by shipping. Real projects, real research, real
              hackathons.
            </p>
          </Reveal>

          <Reveal
            stagger={0.12}
            className="grid sm:grid-cols-2 gap-4 text-left"
          >
            {PRINCIPLES.map(([n, title, desc], index) => (
              <div key={n} className={`card-shell p-6 ${index === 2 ? 'sm:col-span-2' : ''}`}>
                <span className="label-caps text-chrome-lo block mb-3">{n}</span>
                <h3 className="text-chrome-hi text-base font-semibold mb-1.5">
                  {title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
