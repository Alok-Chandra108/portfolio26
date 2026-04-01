# 🌌 Alok Chandra — Portfolio '26

> A high-end, immersive digital experience built with React 19, GSAP, and a focus on premium motion design.

---

## 💎 Philosophy

This portfolio is not just a collection of projects; it's a statement on digital craft. Inspired by the sleek, structural aesthetics of top-tier creative agencies, it prioritizes **fluid motion**, **sophisticated glassmorphism**, and **tactile interactions**.

- **Motion as Meaning**: Animations aren't just decorative; they guide the user's focus and create a rhythmic narrative.
- **Micro-Interactions**: Magnetic elements and custom cursors bridge the gap between user and interface.
- **Glassmorphic Depth**: Deep backdrop blurs and luminous glows create a sense of physical space in a digital medium.

---

## ✨ Key Features

- **🚀 Cinematic Loader**: A full-screen entrance experience with GSAP-orchestrated counter animation that fires on every page refresh.
- **🖱️ Magnetic Custom Cursor**: A persistent, reactive cursor that scales and responds to interactive elements for a premium feel.
- **🌟 Dynamic Hero**: High-impact entry section with scroll-triggered GSAP reveals, a magnetic marquee, and per-character color animations on the name heading.
- **🔢 Numbered Work Showcase**: A high-end, scroll-animated work experience section styled as a structured numbered list.
- **🎓 Education Timeline**: A visually striking "Midnight" dark-mode timeline with neon green accents adhering to a 60-30-10 color rule.
- **📚 Immersive "My Reads"**: A dynamic library system powered by Firebase Firestore, featuring advanced filtering, horizontal card strips on mobile, and an integrated status manager.
- **📖 All Reads Page**: A dedicated `/all-reads` route with a full 2-column portrait card grid and status-based filtering.
- **🔒 Secure Admin Dashboard**: An authenticated `/admin` portal (Firebase Auth) with management panels for Reads, Projects, Experience, and Skills.
- **🛹 Inertial Scrolling**: Integrated with [Lenis](https://lenis.darkroom.engineering/) for that signature "heavy" and smooth scroll feel.
- **📱 5-Tier Responsive System**: Meticulously crafted CSS with `xs`, `sm`, `md`, `lg`, and `xl` breakpoints ensuring flawless layout across all 2026 devices.
- **🌀 Page Transitions**: GSAP-powered route transitions that maintain context and reduce cognitive load.

---

## 🔮 Future Roadmap

- **✍️ Interactive Experience CMS**: Building out the Admin forms for managing the Work Experience section dynamically via Firestore.
- **🖼️ Advanced Image Optimization**: Implementing lazy loading and automated WebP conversions for high-res project photography.

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
│   │   │   └── Work.jsx / .css
│   │   ├── ui/                   # Reusable atomic components
│   │   │   ├── AnimatedButton.jsx / .css
│   │   │   ├── BookCard.jsx / .css
│   │   │   ├── DownloadCV.jsx / .css
│   │   │   ├── PillTag.jsx / .css
│   │   │   └── ProjectCard.jsx / .css
│   │   ├── CustomCursor.jsx / .css
│   │   ├── Footer.jsx / .css
│   │   ├── Loader.jsx / .css     # Cinematic page-load experience
│   │   ├── Marquee.jsx / .css
│   │   ├── Navbar.jsx / .css
│   │   ├── PageTransition.jsx    # GSAP route transition wrapper
│   │   └── ProtectedRoute.jsx    # Auth-guarded navigation
│   ├── context/
│   │   └── AuthContext.jsx       # Firebase auth state provider
│   ├── data/                     # Static local data for seeding/mockups
│   │   ├── books.js
│   │   ├── education.js
│   │   └── projects.js
│   ├── firebase/
│   │   └── config.js             # Firestore & Auth initialization
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
| `src/components/sections` | High-impact visual blocks: `Hero`, `Work`, `Education`, `MyReads`, `Services`, `About`, `CTASection`. | **Organisms**: Self-contained layout units with co-located CSS. |
| `src/components/ui` | Reusable, stateless components: `BookCard`, `ProjectCard`, `AnimatedButton`, `PillTag`, `DownloadCV`. | **Atoms/Molecules**: Highly composable across different sections. |
| `src/pages` | Full route views: `Home`, `AboutPage`, `WorkPage`, `AllReadsPage`, `ContactPage`, `Login`, `AdminDashboard`. | **Pages**: Thin orchestration layers that compose sections. |
| `src/pages/admin` | Private views for managing Reads, Projects, Experience, and Skills data. | **Admin Portal**: Protected by `ProtectedRoute` + Firebase Auth. |
| `src/styles` | Global design tokens, resets, typography scale, and admin-specific styles. | **Design System**: CSS variables shared across all components. |
| `src/context` | Centralized Firebase auth state via React Context. | **Provider Pattern**: Injects auth state into the component tree. |
| `src/firebase` | Firebase App initialization, Firestore DB, and Auth export. | **Service Layer**: Decouples database logic from UI components. |
| `src/utils` | GSAP plugin registration (`gsapPlugins.js`) and reusable animation factories (`animationHelpers.js`). | **Animation Layer**: Keeps motion logic DRY and centralized. |
| `src/data` | Local JS data files for `books`, `education`, and `projects`. | **Static Seed Data**: Used as fallback/mockup before Firestore is live. |

---

## 🛠️ Tech Stack

### 🚀 Frontend
- **Framework**: [React 19](https://react.dev/) (`^19.2.4`) — Leveraging the latest concurrent features.
- **Routing**: [React Router 7](https://reactrouter.com/) (`^7.13.1`) — Dynamic paths, nested routes, and auth guards.
- **Motion**: [GSAP 3.14](https://greensock.com/gsap/) (`^3.14.2`) + [@gsap/react](https://www.npmjs.com/package/@gsap/react) — Industry-standard, GPU-accelerated animations with `ScrollTrigger`.
- **Scrolling**: [Lenis](https://lenis.darkroom.engineering/) (`^1.3.18`) — Buttery-soft inertial scrolling across all browsers.
- **Styling**: **Vanilla Modern CSS** — CSS Variables, Clamp, and a custom 5-tier breakpoint system. Zero styling dependencies.

### 🛡️ Backend & Security
- **Auth**: [Firebase Authentication](https://firebase.google.com/products/auth) (`firebase ^12.11.0`) — Securing the `/admin` portal.
- **Database**: [Cloud Firestore](https://firebase.google.com/products/firestore) — Real-time sync for reads, projects, and experience data.

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
3. Add all `VITE_FIREBASE_*` keys as **Environment Variables** in the Vercel project settings.
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
