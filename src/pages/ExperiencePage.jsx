import { useState, useEffect, useRef } from 'react';
import { gsap, useGSAP } from '../utils/gsapPlugins.js';
import { experienceService } from '../firebase/experienceService.js';
import DownloadCV from '../components/ui/DownloadCV.jsx';
import AnimatedButton from '../components/ui/AnimatedButton.jsx';
import SEO from '../components/ui/SEO.jsx';
import './ExperiencePage.css';

const placeholderData = [
  {
    id: 'p1',
    role: 'Lead DevOps & Cloud Engineer',
    company: 'Tech Scale-Up',
    location: 'Bengaluru / Remote',
    startDate: '2023',
    endDate: 'Present',
    isCurrent: true,
    description: 'Architected automated Kubernetes deployment pipelines reducing release times by 65%. Scaled multi-region AWS cloud infrastructure handling 10M+ daily events with 99.99% uptime target.',
    skills: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD', 'Docker', 'Prometheus']
  },
  {
    id: 'p2',
    role: 'Senior Infrastructure Engineer',
    company: 'Cloud Native Systems',
    location: 'Remote',
    startDate: '2021',
    endDate: '2023',
    isCurrent: false,
    description: 'Spearheaded migration from monolithic servers to containerized microservices. Implemented Infrastructure-as-Code best practices and centralized observability using Grafana and ELK stack.',
    skills: ['Terraform', 'Docker', 'Grafana', 'GitLab CI', 'Python', 'Linux']
  },
  {
    id: 'p3',
    role: 'DevOps & Systems Administrator',
    company: 'DataTech Innovations',
    location: 'Hybrid',
    startDate: '2020',
    endDate: '2021',
    isCurrent: false,
    description: 'Managed hybrid cloud environments, automated database backup workflows, and implemented Zero Trust network access controls across 150+ internal developers.',
    skills: ['Linux', 'Bash', 'Ansible', 'Nginx', 'PostgreSQL', 'Security']
  }
];

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    experienceService.getExperience()
      .then(data => {
        const workData = data.filter(exp => exp.type !== 'education');
        setExperiences(workData.length > 0 ? workData : placeholderData);
      })
      .catch(() => setExperiences(placeholderData))
      .finally(() => setLoading(false));
  }, []);

  useGSAP(() => {
    if (loading) return;

    // Header reveal
    gsap.from(headerRef.current, {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      delay: 0.1
    });

    // Rows reveal
    if (listRef.current?.children) {
      gsap.from(listRef.current.children, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.3
      });
    }
  }, { dependencies: [loading], scope: containerRef });

  return (
    <div className="experience-page brutal-ledger" ref={containerRef}>
      <SEO 
        title="Professional Experience | Alok Chandra" 
        description="Comprehensive professional career record and experience archive of Alok Chandra across cloud platforms, DevOps automation, and infrastructure engineering."
      />
      
      {/* Ledger Header */}
      <header className="ledger-header" ref={headerRef}>
        <h1 className="ledger-header__title">
          PROFESSIONAL<br/>
          <span className="italic">RECORD</span>
        </h1>
        <div className="ledger-header__cols mono-label desktop-only">
          <span>TIMEFRAME</span>
          <span>ROLE / DESIGNATION</span>
          <span>ORGANIZATION</span>
        </div>
      </header>

      {/* Ledger Rows */}
      <div className="ledger-list" ref={listRef}>
        {experiences.map((exp, index) => (
          <article key={exp.id} className="ledger-row">
            
            {/* Visible Row Header */}
            <div className="ledger-row__header">
              <div className="ledger-row__col ledger-row__time mono-label">
                {exp.startDate} — {exp.isCurrent ? 'PRESENT' : exp.endDate}
              </div>
              <div className="ledger-row__col ledger-row__role">
                <h2>{exp.role}</h2>
              </div>
              <div className="ledger-row__col ledger-row__company mono-label">
                {exp.company}
              </div>
              
              <div className="ledger-row__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </div>
            </div>

            {/* Hidden Drawer on Hover */}
            <div className="ledger-row__drawer">
              <div className="ledger-row__drawer-inner">
                <div className="ledger-row__details">
                  <p className="ledger-row__desc body-text">
                    {exp.description}
                  </p>
                  
                  {exp.skills && exp.skills.length > 0 && (
                    <div className="ledger-row__skills">
                      {exp.skills.map(skill => (
                        <span key={skill} className="ledger-tag mono-label">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
          </article>
        ))}
      </div>

      {/* Footer / Resume CTA */}
      <div className="ledger-footer">
        <h3 className="ledger-footer__title">COMPLETE ARCHIVE</h3>
        <div className="ledger-footer__actions">
          <DownloadCV />
          <AnimatedButton to="/contact">INITIATE COMMS</AnimatedButton>
        </div>
      </div>

    </div>
  );
}
