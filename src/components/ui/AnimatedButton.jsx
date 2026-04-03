import { Link } from 'react-router-dom';
import Magnetic from './Magnetic.jsx';
import './AnimatedButton.css';

export default function AnimatedButton({ to, children, onClick, variant = 'dark', strength = 0.4 }) {
  const className = `animated-btn animated-btn--${variant}`;

  if (to) {
    return (
      <Magnetic strength={strength}>
        <Link to={to} className={className}>
          <span className="animated-btn__text">{children}</span>
          <span className="animated-btn__arrow">→</span>
        </Link>
      </Magnetic>
    );
  }

  return (
    <Magnetic strength={strength}>
      <button className={className} onClick={onClick}>
        <span className="animated-btn__text">{children}</span>
        <span className="animated-btn__arrow">→</span>
      </button>
    </Magnetic>
  );
}
