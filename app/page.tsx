import dynamic from "next/dynamic";
import Nav from "@/components/ui/Nav";
import ScrollProgress from "@/components/ui/ScrollProgress";
import Hero from "@/components/sections/Hero";

// Below-the-fold sections code-split off the initial bundle (SSR stays on).
const About = dynamic(() => import("@/components/sections/About"));
const Experience = dynamic(() => import("@/components/sections/Experience"));
const Projects = dynamic(() => import("@/components/sections/Projects"));
const Pipeline = dynamic(() => import("@/components/sections/Pipeline"));
const Skills = dynamic(() => import("@/components/sections/Skills"));
const Education = dynamic(() => import("@/components/sections/Education"));
const Contact = dynamic(() => import("@/components/sections/Contact"));

export default function Page() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-bg focus:outline-none focus:ring-2 focus:ring-blue"
      >
        Skip to content
      </a>
      <Nav />
      <ScrollProgress />
      <main id="main" tabIndex={-1} className="relative">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Pipeline />
        <Skills />
        <Education />
        <Contact />
      </main>
    </>
  );
}
