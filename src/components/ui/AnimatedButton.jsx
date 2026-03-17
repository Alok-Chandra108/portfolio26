import { Link } from 'react-router-dom';
import './AnimatedButton.css';

export default function AnimatedButton({ to, children, onClick, variant = 'dark' }) {
  const className = `animated-btn animated-btn--${variant}`;

  if (to) {
    return (
      <Link to={to} className={className}>
        <span className="animated-btn__text">{children}</span>
        <span className="animated-btn__arrow">→</span>
      </Link>
    );
  }

  return (
    <button className={className} onClick={onClick}>
      <span className="animated-btn__text">{children}</span>
      <span className="animated-btn__arrow">→</span>
    </button>
  );
}
