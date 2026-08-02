import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Team from "@/components/Team";
import Projects from "@/components/Projects";
import Events from "@/components/Events";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import StackedSections from "@/components/StackedSections";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <StackedSections>
          <div className="stack-panel stack-panel--first">
            <About />
          </div>
          <div className="stack-panel">
            <Team />
          </div>
          <div className="stack-panel">
            <Projects />
          </div>
          <div className="stack-panel">
            <Events />
          </div>
          <div className="stack-panel">
            <Contact />
          </div>
        </StackedSections>
      </main>
      <Footer />
    </>
  );
}
