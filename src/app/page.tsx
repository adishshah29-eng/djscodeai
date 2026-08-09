import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Team from "@/components/Team";
import Projects from "@/components/Projects";
import Events from "@/components/Events";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";
const Chatbot = dynamic(() => import("@/components/Chatbot"));
import Preloader from "@/components/Preloader";

export default function Home() {
  return (
    <>
      <Preloader />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <About />
        <Team />
        <Projects />
        <Events />
        <Contact />
      </main>
      <Footer />
      <Chatbot />
    </>
  );
}
