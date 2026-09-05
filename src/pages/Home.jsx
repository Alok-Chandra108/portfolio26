import SEO from '../components/ui/SEO.jsx';
import Hero from '../components/sections/Hero.jsx';
import Work from '../components/sections/Work.jsx';
import About from '../components/sections/About.jsx';
import Education from '../components/sections/Education.jsx';
import Experience from '../components/sections/Experience.jsx';
import MyReads from '../components/sections/MyReads.jsx';
import SkillsSection from '../components/sections/SkillsSection.jsx';
import CTASection from '../components/sections/CTASection.jsx';

export default function Home() {
  return (
    <>
      <SEO 
        title="Alok Chandra — Lead DevOps & Cloud Engineer"
        description="Portfolio of Alok Chandra — Specializing in Cloud Infrastructure, Kubernetes, Automation, DevOps, and Full Stack Systems Engineering."
      />
      <Hero />
      <Work />
      <About />
      <Education />
      <Experience preview={true} />
      <SkillsSection />
      <MyReads />
      <CTASection />
    </>
  );
}
