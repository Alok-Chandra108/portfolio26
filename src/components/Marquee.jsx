import './Marquee.css';

export default function Marquee() {
  const content = 'React ✦ GSAP ✦ Next.js ✦ Figma ✦ Webflow ✦ Three.js ✦ TypeScript ✦ Node.js ✦ Framer ✦ ';

  return (
    <section className="marquee-strip">
      <div className="marquee-strip__track">
        <span className="marquee-strip__text">{content}</span>
        <span className="marquee-strip__text">{content}</span>
        <span className="marquee-strip__text">{content}</span>
      </div>
    </section>
  );
}
