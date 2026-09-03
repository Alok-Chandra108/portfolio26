import { useEffect, useRef, useState } from 'react';
import { gsap } from '../../utils/gsapPlugins.js';
import { skillsService } from '../../firebase/skillsService.js';
import './SkillsSection.css';

export default function SkillsSection() {
  const sectionRef = useRef(null);
  const [skills, setSkills] = useState([]);

  const row1TrackRef = useRef(null);
  const row2TrackRef = useRef(null);

  useEffect(() => {
    skillsService.getSkills()
      .then(data => setSkills(data || []))
      .catch(err => console.error('Error fetching skills:', err));
  }, []);

  const row1Skills = skills.filter(s => (s.row || 1) === 1);
  const row2Skills = skills.filter(s => s.row === 2);

  // ── Optimised marquee: pause off-screen & hidden tab, hover-to-slow, cached widths ──
  useEffect(() => {
    if (skills.length === 0) return;

    const rowConfigs = [
      { track: row1TrackRef.current, baseSpeed: 2.2, dir:  1 },
      { track: row2TrackRef.current, baseSpeed: 1.8, dir: -1 },
    ];

    // State per row — half cached here, refreshed by ResizeObserver
    const state = rowConfigs.map(r => ({
      track:     r.track,
      baseSpeed: r.baseSpeed,
      dir:       r.dir,
      half:      r.track ? r.track.scrollWidth / 2 : 0,
      x:         r.dir === -1 && r.track ? -(r.track.scrollWidth / 2) : 0,
      vel:       r.baseSpeed * r.dir,
    }));

    // ── Scroll velocity ──────────────────────────────────────────────────────────
    let scrollVel = 0;
    let lastScrollY = window.scrollY;
    let decayTimer = null;

    const onScroll = () => {
      const y = window.scrollY;
      scrollVel += (y - lastScrollY) * 0.6;
      scrollVel = Math.max(-30, Math.min(30, scrollVel));
      lastScrollY = y;
      clearTimeout(decayTimer);
      decayTimer = setTimeout(() => { scrollVel = 0; }, 100);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // ── Hover-to-slow ────────────────────────────────────────────────────────────
    let hoverSlowdown = 1; // multiplier: 1 = full speed, 0.15 = near-stop
    const container = sectionRef.current?.querySelector('.skills-marquee-container');
    const onMouseEnter = () => { hoverSlowdown = 0.15; };
    const onMouseLeave = () => { hoverSlowdown = 1; };
    container?.addEventListener('mouseenter', onMouseEnter);
    container?.addEventListener('mouseleave', onMouseLeave);

    // ── Ticker ───────────────────────────────────────────────────────────────────
    let running = true;

    const tick = gsap.ticker.add(() => {
      if (!running) return;
      scrollVel *= 0.85;

      state.forEach(s => {
        if (!s.track || s.half === 0) return;

        const scrollBoost = scrollVel * s.dir * 0.15;
        const targetVel   = s.baseSpeed * s.dir * hoverSlowdown + scrollBoost;
        s.vel += (targetVel - s.vel) * 0.12;
        s.x   += s.vel;

        // Seamless wrap using cached half-width
        s.x = ((s.x % s.half) + s.half) % s.half;
        if (s.x > 0) s.x -= s.half;

        gsap.set(s.track, { x: s.x, force3D: true });
      });
    });

    // ── Pause when section is off-screen (IntersectionObserver) ─────────────────
    const io = new IntersectionObserver(
      ([entry]) => { running = entry.isIntersecting; },
      { threshold: 0 }
    );
    if (sectionRef.current) io.observe(sectionRef.current);

    // ── Pause when browser tab is hidden ─────────────────────────────────────────
    const onVisibility = () => { running = !document.hidden; };
    document.addEventListener('visibilitychange', onVisibility);

    // ── ResizeObserver — refresh cached half-widths on resize ────────────────────
    const ro = new ResizeObserver(() => {
      state.forEach(s => {
        if (s.track) s.half = s.track.scrollWidth / 2;
      });
    });
    state.forEach(s => { if (s.track) ro.observe(s.track); });

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
      container?.removeEventListener('mouseenter', onMouseEnter);
      container?.removeEventListener('mouseleave', onMouseLeave);
      clearTimeout(decayTimer);
      io.disconnect();
      ro.disconnect();
    };
  }, [skills]);

  if (skills.length === 0) return null;

  return (
    <section className="skills-section" ref={sectionRef}>
      <div className="skills-section__header container">
        <span className="skills-section__subtitle">(EXPERTISE)</span>
        <h2 className="skills-section__title">I keep good skills.</h2>
      </div>

      <div className="skills-marquee-container">
        {/* ROW 1 — scrolls left */}
        {row1Skills.length > 0 && (
          <div className="skills-marquee-row-wrapper">
            <div className="skills-marquee-row" ref={row1TrackRef}>
              {[...row1Skills, ...row1Skills, ...row1Skills, ...row1Skills, ...row1Skills, ...row1Skills].map((skill, i) => (
                <SkillCard key={`row1-${skill.id}-${i}`} skill={skill} />
              ))}
            </div>
          </div>
        )}

        {/* ROW 2 — scrolls right, offset via CSS class */}
        {row2Skills.length > 0 && (
          <div className="skills-marquee-row-wrapper skills-marquee-row-wrapper--offset">
            <div className="skills-marquee-row" ref={row2TrackRef}>
              {[...row2Skills, ...row2Skills, ...row2Skills, ...row2Skills, ...row2Skills, ...row2Skills].map((skill, i) => (
                <SkillCard key={`row2-${skill.id}-${i}`} skill={skill} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function SkillCard({ skill }) {
  return (
    <div className="skill-card">
      <div className="skill-card__logo-wrap">
        <img src={skill.logoUrl} alt={skill.name} className="skill-card__logo" loading="lazy" />
      </div>
      <h3 className="skill-card__name">{skill.name}</h3>
    </div>
  );
}