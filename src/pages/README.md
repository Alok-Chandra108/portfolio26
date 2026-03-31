# 📄 Pages & Routing

This directory contains the full-page views which serve as the top-level route targets.

## 🛣️ Navigation Structure

The application's routing map (managed in `App.jsx`):

| Path | Component | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `/` | `Hero.jsx` (Home) | ❌ | The main landing page with GSAP entry. |
| `/login` | `Login.jsx` | ❌ | Entry point for Firebase Auth. |
| `/admin` | `AdminDashboard.jsx` | ✅ | Administrative entry for data management. |
| `/admin/projects` | `AdminProjects.jsx` | ✅ | CRUD interface for portfolio items. |
| `/admin/reads` | `AdminReads.jsx` | ✅ | CRUD interface for the library system. |

## 📦 Data Handling

- **Static Pages**: Rely on local JSON files in `src/data/` for high-performance static rendering.
- **Admin Pages**: Use Firebase SDK to fetch and mutate real-time data from Cloud Firestore.
- **Route Persistence**: Each page view is wrapped in a `PageTransition` to maintain the 60fps motion feel even during navigation switches.

## 📜 Development Standards

- **Lazy Loading**: Use `React.lazy()` for admin routes as they are low-priority for the initial initial bundle size. (Work in progress)
- **Error Boundaries**: Each major page should be wrapped in an error boundary to prevent full-app crashes.
