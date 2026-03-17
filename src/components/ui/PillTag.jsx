import './PillTag.css';

export default function PillTag({ children, variant = 'dark' }) {
  return (
    <span className={`pill-tag pill-tag--${variant}`}>
      {children}
    </span>
  );
}
