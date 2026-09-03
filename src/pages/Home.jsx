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
