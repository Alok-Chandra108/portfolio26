# 🏗️ Components Architecture

This directory follows a **Modified Atomic Design** approach to ensure scalability and maintainability.

## 📁 Directory Structure

- **`sections/`**: The "Organisms" of the application. These are high-level building blocks that take up a full viewport height or a major section of a page (e.g., `Hero.jsx`, `Services.jsx`). Each component here should have its own scoped CSS file in `src/styles/sections/`.
- **`ui/`**: The "Atoms" and "Molecules". Highly reusable, stateless components like buttons, book cards, and skill pills. These are designed to be context-agnostic.
- **`admin/`**: Components specifically for the CMS/Management portal.

## 🛠️ Specialized Components

- **`CustomCursor.jsx`**: A magnetic, reactive pointer that follows the mouse across the entire application viewport.
- **`Loader.jsx`**: Orchestrates the initial GSAP-powered preloader experience.
- **`Navbar.jsx`**: A sticky/fixed navigation bar with scroll-triggered styling.
- **`ProtectedRoute.jsx`**: An HOC redirecting unauthenticated users away from private `/admin` routes.
- **`PageTransition.jsx`**: Manages the exit/entry animations between router view switches.

## 📜 Development Standards

1. **One Component per File**: Each JSX file should export exactly one React component.
2. **Modular CSS**: Styles should be isolated. Never use absolute units (use `rem` or `vh/vw`) except for small fixed borders.
3. **GSAP Context**: Always use `@gsap/react` hooks to ensure animations are properly cleaned up on component unmount.
