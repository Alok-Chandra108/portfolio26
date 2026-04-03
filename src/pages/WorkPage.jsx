import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP } from '../utils/gsapPlugins.js';
import ProjectCard from '../components/ui/ProjectCard.jsx';
import { projectsService } from '../firebase/projectsService';
import './WorkPage.css';

export default function WorkPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const gridRef = useRef(null);

  /* ── Data Fetching ───────────────────────── */
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectsService.getProjects();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects for WorkPage:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  /* ── Entrance Animation ──────────────────── */
  useGSAP(() => {
    if (loading || projects.length === 0) return;

    const cards = gridRef.current?.children;
    if (cards?.length) {
      gsap.from(cards, {
        y: 80,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.3,
      });
    }
  }, { dependencies: [loading, projects], scope: gridRef });

  if (loading && projects.length === 0) {
    return (
      <div className="work-page" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p className="mono-label" style={{ opacity: 0.5 }}>Syncing selected work...</p>
      </div>
    );
  }

  return (
    <div className="work-page">
      <div className="container">
        <div className="work-page__header">
          <h1 className="heading-hero">SELECTED WORK</h1>
          <span className="sub-label">(Projects)</span>
        </div>
        <div className="work-page__grid" ref={gridRef}>
          {projects.map(project => (
            <div key={project.id}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
