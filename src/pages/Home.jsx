import Hero from '../components/sections/Hero.jsx';
import Services from '../components/sections/Services.jsx';
import Work from '../components/sections/Work.jsx';
import About from '../components/sections/About.jsx';
import Education from '../components/sections/Education.jsx';
import MyReads from '../components/sections/MyReads.jsx';
import Marquee from '../components/Marquee.jsx';
import CTASection from '../components/sections/CTASection.jsx';

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <Work />
      <About />
      <Education />
      <MyReads />
      <Marquee />
      <CTASection />
    </>
  );
}
