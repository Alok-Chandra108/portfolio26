# 🌌 Alok Chandra — Portfolio '26

> A high-end, immersive digital experience built with React 19, GSAP, and a focus on premium motion design.

---

## 💎 Philosophy

This portfolio is not just a collection of projects; it's a statement on digital craft. Inspired by the sleek, structural aesthetics of top-tier creative agencies, it prioritizes **fluid motion**, **sophisticated glassmorphism**, and **tactile interactions**.

- **Motion Architecture**: All animations are built on a systematic foundation using **GSAP** (`@gsap/react`), **Lenis** for smooth momentum-based scrolling, and **Framer Motion** for layout orchestration. This unified stack ensures all transitions feel deliberate, smooth, and performant.
- **Micro-Interactions**: Magnetic elements, custom cursors, and per-character hover effects bridge the gap between user and interface.
- **Glassmorphic Depth**: Deep backdrop blurs and luminous glows create a sense of physical space in a digital medium.

---

## ✨ Key Features

- **🚀 Cinematic Loader**: A high-performance, visually engaging entrance experience with a GSAP-orchestrated counter animation that triggers on every page refresh to ensure brand consistency.
- **🖱️ Magnetic Custom Cursor**: A persistent, reactive cursor that scales and responds to interactive elements with liquid-smooth lag-free movement.
- **🌟 Dynamic Hero**: High-impact entry section featuring scroll-triggered GSAP reveals, a magnetic marquee, and a name heading with **per-character dynamic coloring** on hover.
- **🏗️ Interactive "Skills Lattice"**: A dual-row, infinite scrolling marquee with scroll-driven parallax shifts, showcasing core competencies with a high-end editorial feel.
- **☁️ Cloud & DevOps Services**: A structured services section highlighting expertise in **Infrastructure (AWS/GCP)**, **CI/CD (GitHub Actions)**, and **Monitoring (Prometheus/Grafana)** with GSAP-animated entry reveals.
- **🎓 Education Timeline**: A visually striking "Midnight" dark-mode timeline with neon green accents, strictly adhering to the **60-30-10 color rule** for max impact.
- **📚 Immersive "My Reads"**: A real-time library powered by Firestore, featuring **mobile-optimized horizontal card strips** and sleek desktop grid transitions.
- **📖 All Reads Page**: A dedicated `/reads` route with a refined 2-column portrait card grid and advanced status-based filtering.
- **🎯 Interactive CTAs**: Premium "Ready to Scale" call-to-action sections with cursor-following background effects and letter-spacing animations.
- **🌍 Photorealistic 3D Globe**: A high-end, interactive Earth visualization on the Contact page, featuring **multi-layer GLSL shaders** for atmospheric scattering, cloud layers, and real-time day/night cycles.
- **🌊 Premium Green Page Transitions**: A cinematic **clip-path "Green Sweep"** animation that orchestrates page switches with fluid logic, ensuring 100% brand consistency through an upward-motion sweep.
- **📱 5-Tier Responsive System**: Precision-engineered CSS with `xs`, `sm`, `md`, `lg`, and `xl` breakpoints, utilizing `clamp()` for fluid typography and flawless layouts from 320px to 4K.

---

## 🔮 Future Roadmap

- **✍️ Interactive Experience CMS**: Building out the Admin forms for managing the Work Experience section dynamically via Firestore.
- **🖼️ Advanced Image Optimization**: Implementing lazy loading and automated WebP conversions for high-res project photography.
- **🌐 Global Traffic Visualization**: Expanding the 3D globe to include real-time project hit visualizations and animated data arcs.

---

## 🏗️ Project Architecture

A complete overview of the repository's current structure:

```text
prime-einstein/
├── public/                       # Static assets (favicon, fonts, etc.)
├── src/
│   ├── assets/                   # Global visual assets (SVGs, Lottie, images)
│   ├── components/
│   │   ├── admin/                # (Reserved) Admin-specific sub-components
│   │   ├── sections/             # Full-page section organisms
│   │   │   ├── About.jsx / .css
│   │   │   ├── CTASection.jsx / .css
│   │   │   ├── Education.jsx / .css
│   │   │   ├── Hero.jsx / .css
│   │   │   ├── MyReads.jsx / .css
│   │   │   ├── Services.jsx / .css
│   │   │   ├── SkillsSection.jsx / .css
│   │   │   └── Work.jsx / .css
│   │   ├── ui/                   # Reusable atomic components
│   │   │   ├── Globe/            # Cinematic 3D Visualization system
│   │   │   │   ├── Atmosphere.jsx
│   │   │   │   ├── Clouds.jsx
│   │   │   │   ├── Earth.jsx
│   │   │   │   ├── GlobeScene.jsx
│   │   │   │   └── GlobeShaders.js
│   │   │   ├── AnimatedButton.jsx / .css
│   │   │   ├── BookCard.jsx / .css
│   │   │   ├── DownloadCV.jsx / .css
│   │   │   ├── PillTag.jsx / .css
│   │   │   └── ProjectCard.jsx / .css
│   │   ├── AnimatedRoutes.jsx    # Framer Motion route orchestrator
│   │   ├── CustomCursor.jsx / .css
│   │   ├── Footer.jsx / .css
│   │   ├── Loader.jsx / .css     # Cinematic page-load experience
│   │   ├── Marquee.jsx / .css
│   │   ├── Navbar.jsx / .css
│   │   ├── PageWrapper.jsx       # Framer Motion page transition wrapper
│   │   ├── ProtectedRoute.jsx    # Auth-guarded navigation
│   │   └── SmoothScroll.jsx      # Lenis smooth scroll implementation
│   ├── context/
│   │   └── AuthContext.jsx       # Firebase auth state provider
│   ├── data/                     # Static local data for seeding/mockups
│   │   ├── books.js
│   │   ├── education.js
│   │   └── projects.js
│   ├── firebase/
│   │   ├── config.js             # Firestore & Auth initialization
│   │   ├── projectsService.js    # Data fetching for projects
│   │   └── skillsService.js      # Data fetching for skills
│   ├── pages/
│   │   ├── admin/                # Full-page authenticated admin views
│   │   │   ├── AdminExperience.jsx
│   │   │   ├── AdminProjects.jsx
│   │   │   ├── AdminReads.jsx
│   │   │   └── AdminSkills.jsx
│   │   ├── AboutPage.jsx / .css
│   │   ├── AdminDashboard.jsx
│   │   ├── AllReadsPage.jsx / .css
│   │   ├── ContactPage.jsx / .css
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   └── WorkPage.jsx / .css
│   ├── styles/                   # Global stylesheets
│   │   ├── admin.css             # Admin portal-specific styles
│   │   ├── globals.css           # CSS variables, resets & design tokens
│   │   └── typography.css        # Font imports & type scale
│   ├── utils/
│   │   ├── animationHelpers.js   # Reusable GSAP animation factories
│   │   └── gsapPlugins.js        # GSAP plugin registration (ScrollTrigger, etc.)
│   ├── App.jsx                   # Root router & layout orchestration
│   └── main.jsx                  # React 19 entry point
├── .env.local                    # Firebase credentials (not committed)
├── eslint.config.js              # ESLint 9 flat config
├── index.html                    # Vite HTML entry
├── package.json
├── vercel.json                   # SPA redirect rules for Vercel
└── vite.config.js                # Vite build configuration
```

---

## 🔍 Deep Folder Analysis

| Directory | Purpose | Design Pattern |
| :--- | :--- | :--- |
| `src/components/sections` | High-impact visual blocks: `Hero`, `Work`, `SkillsSection`, `Education`, `MyReads`, `Services`, `About`, `CTASection`. | **Organisms**: Self-contained layout units with co-located CSS. |
| `src/components` | Layout and orchestration: `AnimatedRoutes`, `PageWrapper`, `SmoothScroll`, `Navbar`, `Footer`, `Loader`. | **Orchestration**: Manages routing, smooth scroll, and global UI state. |
| `src/components/ui` | Reusable, stateless components: `BookCard`, `ProjectCard`, `AnimatedButton`, `PillTag`, `DownloadCV`. | **Atoms/Molecules**: Highly composable across different sections. |
| `src/components/ui/Globe` | Multi-layered 3D Earth visualization using R3F and three-globe. | **Three.js Layer**: Decoupled 3D logic with custom GLSL shaders. |
| `src/pages` | Full route views: `Home`, `AboutPage`, `WorkPage`, `AllReadsPage`, `ContactPage`, `Login`, `AdminDashboard`. | **Pages**: Thin orchestration layers that compose sections. |
| `src/pages/admin` | Private views for managing Skills, Reads, Projects, and Experience data. | **Admin Portal**: Protected by `ProtectedRoute` + Firebase Auth. |
| `src/styles` | Global design tokens, resets, typography scale, and admin-specific styles. | **Design System**: CSS variables shared across all components. |
| `src/context` | Centralized Firebase auth state via React Context. | **Provider Pattern**: Injects auth state into the component tree. |
| `src/firebase` | Firebase initialization and specific service layers for Firestore data. | **Service Layer**: Decouples database logic from UI components. |
| `src/utils` | GSAP plugin registration (`gsapPlugins.js`) and reusable animation helpers. | **Animation Layer**: Keeps motion logic DRY and centralized. |
| `src/data` | Local JS data files for `books`, `education`, and `projects`. | **Static Seed Data**: Used as fallback/mockup before Firestore is live. |

---

## 🛠️ Tech Stack

### 🚀 Frontend
- **Framework**: [React 19](https://react.dev/) (`^19.2.4`) — Leveraging the latest concurrent features.
- **Routing**: [React Router 7](https://reactrouter.com/) (`^7.13.1`) — Dynamic paths, nested routes, and auth guards.
- **Motion**: [GSAP 3.14](https://greensock.com/gsap/) (`^3.14.2`), [Framer Motion](https://www.framer.com/motion/) (`^12.38.0`), and [Lenis](https://lenis.darkroom.engineering/) (`^1.3.21`).
- **Styling**: **Vanilla Modern CSS** — CSS Variables, `clamp()` fluid scaling, and a custom **5-tier breakpoint system** (xs, sm, md, lg, xl). Zero styling dependencies for maximum performant control.

### 🛡️ Backend & Security
- **Auth**: [Firebase Authentication](https://firebase.google.com/products/auth) (`firebase ^12.11.0`) — Securing the `/admin` portal.
- **Database**: [Cloud Firestore](https://firebase.google.com/products/firestore) — Real-time sync for skills, reads, projects, and experience data.

### 🛠️ Tooling & DevOps
- **Build**: [Vite 8](https://vitejs.dev/) (`^8.0.0`) — Next-generation frontend tooling with instant HMR.
- **Deployment**: [Vercel](https://vercel.com/) — Edge Network hosting with automated CI/CD via `vercel.json`.
- **Linting**: [ESLint 9](https://eslint.org/) (`^9.39.4`) — Modern flat-config with React Hooks rules enforced.

---

## 📦 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **NPM**: v9.0.0 or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Alok-Chandra108/portfolio26.git
   cd portfolio26
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env.local` file in the root directory and add your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Launch Development Server**:
   ```bash
   npm run dev
   ```
   *The site will be available at `http://localhost:5173`.*

5. **Production Build**:
   ```bash
   npm run build
   ```

---

## 🚀 Deployment

The project is pre-configured for **Vercel**. To deploy your own instance:

1. Push your code to a GitHub/GitLab repository.
2. Connect your repository to Vercel.
3. Add all `VITE_FIREBASE_*` keys as **Environment Variables** in Vercel project settings.
4. The `vercel.json` SPA redirect rules and Vite configuration handle the rest automatically.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` (if present) or the source for more information.

---

## 🤝 Connect

- **Portfolio**: [alokchandra.vercel.app](https://alokchandra.vercel.app)
- **GitHub**: [@Alok-Chandra108](https://github.com/Alok-Chandra108)

---

> Built with ❤️ by Alok Chandra.
