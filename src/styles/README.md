# 🎨 Design System & Styling

This project adheres to a **Vanilla Modern CSS** architecture, prioritizing high performance and Zero-JS styling solutions where possible.

## 🌈 The 60-30-10 Color Rule

To maintain visual balance, the portfolio's "Midnight" theme uses the 60-30-10 rule:

- **60% Primary Color**: `--main`: `#080808` (Darkest backdrop for depth).
- **30% Secondary Color**: `--secondary`: `#111111` (Structural cards, section backgrounds).
- **10% Accent Color**: `--accent`: `#bef352` (Neon green for high-impact interactives and focus states).

## 📁 Directory Structure

- **`globals.css`**: Contains core resets, root variables (`:root`), and global animations.
- **`typography.css`**: Project-wide font families, weights, and clamped fluid heading sizes.
- **`sections/`**: One-to-one CSS mapping for every section in the application (e.g., `Hero.css` for `Hero.jsx`).

## 📜 Development Standards

1. **Vanilla Variables**: Always use CSS variables for colors, spacings, and transition timings to maintain a single source of truth.
2. **Fluid Typography**: Use `clamp()` for all responsive text sizing between mobile and desktop views.
3. **Glassmorphism**: When creating overlays, combine `backdrop-filter: blur()` with low-opacity semi-transparent backgrounds.
4. **No Tailwind**: This project strictly avoids utility-first frameworks to preserve the structural "agency-grade" custom styling.
