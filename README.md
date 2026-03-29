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

- **🚀 Performance-First Hero**: A high-impact entry section with GSAP-orchestrated motion, a magnetic marquee, and smooth text reveals.
- **🖱️ Magnetic Custom Cursor**: A persistent, reactive cursor that scales and responds to interactive elements for a premium feel.
- **📚 Immersive "My Reads"**: A dynamic library system powered by Firebase Firestore, featuring advanced filtering, interactive book cards, and an integrated status manager.
- **🔒 Secure Admin Dashboard**: An authenticated `/admin` portal (Firebase Auth) allowing on-the-fly content management without touching the codebase.
- **🛹 Inertial Scrolling**: Integrated with [Lenis](https://lenis.darkroom.engineering/) for that signature "heavy" and smooth scroll feel.
- **📱 True Fluid Responsiveness**: Meticulously crafted with CSS Clamp and Flexbox/Grid to ensure a flawless experience from mobile to ultra-wide displays.
- **🌀 Seamless Transitions**: Page-to-page motion that maintains context and reduces cognitive load.

---

## 🔮 Future Roadmap

- **✍️ Interactive Experience Timeline**: Building out the CMS forms for managing the Work Experience section dynamically.
- **🖼️ Advanced Image Optimization**: Implementing lazy loading and automated WebP conversions for high-res project photography.

---

## 🛠️ Tech Stack

### Backend & Database
- **Firebase**: Utilizing Firebase Authentication for secured routes and Cloud Firestore for real-time dynamic content syncing.

### Frontend
- **Framework**: [React 19](https://react.dev/) (Concurrent rendering & improved hooks)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **Styling**: Vanilla Modern CSS (CSS Variables, Container Queries, `:has()` selector)

### Motion & Interactions
- **GSAP**: The engine behind every complex animation and scroll-triggered effect.
- **Lenis**: For smooth, high-fidelity inertial scrolling.
- **GSAP Flip**: Used for seamless layout transitions between states.

### Build & Tooling
- **Vite**: Ultra-fast dev server and HMR.
- **ESLint**: Modern flat-config linting for code quality.
- **Vercel**: Optimized edge deployment and performance monitoring.

---

## 🏗️ Project Architecture

```text
prime-einstein/
├── public/                 # Static assets (fonts, icons, etc.)
├── src/
│   ├── assets/             # Global visual assets
│   ├── components/
│   │   ├── sections/       # Major page sections (Hero, About, Work, etc.)
│   │   ├── ui/             # Reusable UI components (Buttons, Pills, Cards)
│   │   ├── CustomCursor.jsx
│   │   ├── Navbar.jsx
│   │   └── Loader.jsx      # Initial entrance experience
│   ├── data/               # Content data for projects, reads, etc.
│   ├── pages/              # Main route views
│   ├── styles/             # Global CSS and typography modules
│   ├── utils/              # Animation helpers and math utilities
│   ├── App.jsx             # Main application entry and router
│   └── main.jsx            # React root mount
└── vite.config.js          # Build configuration
```

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
3. The `vercel.json` and Vite configuration will handle the rest automatically.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` (if present) or the source for more information.

---

## 🤝 Connect

- **Portfolio**: [alokchandra.vercel.app](https://alokchandra.vercel.app)
- **GitHub**: [@Alok-Chandra108](https://github.com/Alok-Chandra108)

---

> Built with ❤️ by Alok Chandra.
