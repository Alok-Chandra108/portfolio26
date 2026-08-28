# Animation Bug Analysis Report

## Critical Bugs

### 1. **Experience.jsx - Race Condition in ExperiencePanel** (Lines 201-238)
**Problem**: The `useEffect` caching `panelCardsRef.current` runs AFTER the `useGSAP` that depends on `activeIndex`. When `activeIndex` changes rapidly, the `useGSAP` callback may execute with stale `panelCardsRef.current` data.

```jsx
// Line 202-207: Runs AFTER render when experiences changes
useEffect(() => {
  panelCardsRef.current = [];
  if (reelRef.current) {
    panelCardsRef.current = Array.from(reelRef.current.querySelectorAll('.experience__panel-card'));
  }
}, [experiences]);

// Line 209-240: Runs when activeIndex changes - may use stale panelCardsRef
useGSAP(() => {
  // ... uses panelCardsRef.current
}, { dependencies: [activeIndex], scope: reelRef });
```

**Fix**: Move the panel card caching inside the `useGSAP` callback or use a ref that updates synchronously.

---

### 2. **Experience.jsx - CSS/GSAP Conflict on Rail Marker** (Experience.css Line 90 + Experience.jsx Line 99-103)
**Problem**: CSS transition on `.experience__rail-marker` conflicts with GSAP animation of the same `top` property.

```css
/* Experience.css Line 90 */
.experience__rail-marker {
  transition: top 0.5s cubic-bezier(0.76, 0, 0.24, 1);  // CONFLICTS with GSAP
}
```

```jsx
// Experience.jsx Line 99-103
gsap.to(markerRef.current, {
  top: `${targetY}%`,
  duration: 0.5,
  ease: 'power3.inOut',  // Different easing!
});
```

**Fix**: Remove CSS transition from the marker element; let GSAP handle it entirely.

---

### 3. **About.jsx - Unused isTablet Condition** (Line 25-29)
**Problem**: MatchMedia defines `isTablet` but never uses it.

```jsx
mm.add({
  isMobile: '(max-width: 639px)',
  isTablet: '(min-width: 640px) and (max-width: 1023px)',  // DEFINED BUT UNUSED
  isDesktop: '(min-width: 1024px)',
}, (ctx) => {
  const { isMobile, isDesktop } = ctx.conditions;  // isTablet NOT destructured
  // ...
});
```

---

### 4. **MyReads.css - !important Override Breaks GSAP on Mobile** (Line 69-72)
**Problem**: The `transform: none !important` prevents GSAP from animating transforms on mobile cards.

```css
.my-reads__card-wrap {
  transform: none !important;  // BLOCKS GSAP TRANSFORMS
}
```

**Fix**: Use a more specific selector or CSS variable approach instead of `!important`.

---

### 5. **About.css - Infinite CSS Animation Ignores prefers-reduced-motion** (Line 28)
**Problem**: The `aboutScroll` animation runs infinitely without respecting reduced motion preference.

```css
.about__photo-strip {
  animation: aboutScroll 30s linear infinite;  // NO reduced-motion handling
}
```

The global `prefers-reduced-motion` in globals.css uses `!important` but may not override `infinite` iteration count in all browsers.

---

### 6. **Navbar.jsx - Potential Null Ref in useGSAP Setup** (Line 36)
**Problem**: `gsap.set(charCInnerRef.current, { yPercent: -50 })` runs without null check.

```jsx
useGSAP(() => {
  gsap.set(charCInnerRef.current, { yPercent: -50 });  // Could be null on first render
}, { scope: navRef });
```

---

### 7. **Experience.jsx - Sparse Array Filter Issue** (Line 67)
**Problem**: `itemsRef.current.filter(Boolean)` creates new array each time, but refs might not be fully populated during initial animation setup.

```jsx
tl.fromTo(itemsRef.current.filter(Boolean),  // NEW ARRAY EACH RUN
  { y: 50, opacity: 0 },
  { y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: 'expo.out' },
  '-=0.8'
);
```

---

## Medium Priority Bugs

### 8. **BookCard.jsx - quickTo Override Pattern** (Lines 21-28, 35-42)
**Issue**: Passing `duration` and `ease` to `quickTo` calls defeats the purpose of `quickTo` (which pre-configures these). Works but not optimal.

### 9. **MyReads.jsx - Confusing Variable Shadowing** (Line 144)
**Issue**: Callback parameter `i` shadows outer loop variable `i`. Functionally correct but confusing.

```jsx
gsap.to(cardRefs.current, {
  y: (i, target) => {  // 'i' here is GSAP's index, not outer 'i'
    const depthOffset = [30, 50, 20, 60][i] || 40;
    return `-=${depthOffset}`;
  },
  // ...
});
```

### 10. **Global CSS - prefers-reduced-motion May Not Stop Infinite Animations** (globals.css Lines 225-234)
**Issue**: `animation-iteration-count: 1 !important` should stop infinite loops, but browser support varies.

---

## Low Priority / Code Quality

### 11. **gsapPlugins.js - Top-Level Await in Non-Module** (Lines 22-86)
**Issue**: Using `await import()` at module top level without `"type": "module"` or proper async IIFE. Works in Vite but technically incorrect.

### 12. **Multiple Components - Missing cleanup for ScrollTrigger**
Some `useGSAP` callbacks create ScrollTriggers but rely on `useGSAP` cleanup. Explicit `invalidateOnRefresh: true` is used but `ScrollTrigger.refresh()` is called globally in App.jsx which handles most cases.

---

## Recommended Fixes Priority Order

1. **Critical**: ExperiencePanel race condition (#1)
2. **Critical**: CSS/GSAP conflict on rail marker (#2)
3. **Critical**: Mobile transform override (#4)
4. **Critical**: Infinite animation reduced motion (#5)
5. **High**: Null ref guard in Navbar (#6)
6. **High**: Sparse array handling in Experience (#7)
7. **Medium**: quickTo optimization in BookCard (#8)
8. **Medium**: Variable shadowing cleanup in MyReads (#9)
9. **Medium**: Global reduced-motion robustness (#10)
10. **Low**: Unused isTablet condition (#3)
11. **Low**: gsapPlugins.js module pattern (#11)
