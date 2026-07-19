# Animation Bugs Audit - Complete Site Review

**Date:** 2026-07-19  
**Project:** prime-einstein Portfolio  
**Review Method:** Comprehensive manual code review of all animation components

---

## Summary

| Component | Bugs Found | Critical | Major | Minor |
|-----------|------------|----------|-------|-------|
| **Hero.jsx** | 3 | 0 | 2 | 1 |
| **Navbar.jsx** | 4 | 1 | 2 | 1 |
| **Work.jsx** | 4 | 1 | 2 | 1 |
| **Experience.jsx** | 5 | 1 | 3 | 1 |
| **Education.jsx** | 3 | 0 | 2 | 1 |
| **SkillsSection.jsx** | 2 | 0 | 1 | 1 |
| **About.jsx** | 2 | 0 | 1 | 1 |
| **CTASection.jsx** | 2 | 1 | 1 | 0 |
| **Footer.jsx** | 1 | 0 | 0 | 1 |
| **TOTAL** | **26** | **4** | **14** | **8** |

---

## 🔴 CRITICAL BUGS (Must Fix)

### 1. Navbar.jsx - Line 29-57: Menu Animation Missing `contextSafe` & Cleanup
**Lines:** 29-57  
**Issue:** The `useGSAP` callback for menu open/close creates GSAP tweens but doesn't wrap them in `contextSafe`, and the cleanup function only runs on close (not on unmount). On rapid toggle or unmount, this leaves dangling tweens.

```jsx
// CURRENT (lines 29-57):
useGSAP(() => {
  if (!menuOverlayRef.current) return;
  if (menuOpen) {
    gsap.to(menuOverlayRef.current, { ... });  // NOT wrapped in contextSafe
    menuLinksRef.current.forEach((link, i) => {
      if (!link) return;
      gsap.fromTo(link, ...);  // NOT wrapped
    });
  } else {
    gsap.to(menuOverlayRef.current, { ... });
  }
}, { dependencies: [menuOpen] });  // NO scope!
```

**Fix Required:** Add `{ scope: navRef }` and wrap animations in `contextSafe` (from `useGSAP({ scope: navRef })` contextSafe).

---

### 2. Work.jsx - Line 182, 192-193: Ref Array Mutation During Render (Anti-pattern)
**Lines:** 182, 192-193  
**Issue:** Mutating ref arrays inline during render causes stale refs and inconsistent state across renders.

```jsx
// CURRENT (lines 182, 192-193):
{linesRef.current.length = 0}  // Line 182 - MUTATION DURING RENDER
{rowsRef.current.length = 0}   // Line 192 - MUTATION DURING RENDER
{linesRef.current.length = 0}  // Line 193 - MUTATION DURING RENDER
```

**Fix Required:** Move to `useEffect` or `useLayoutEffect` with proper cleanup, or use `useGSAP` with `dependencies: [projects]` to reset.

---

### 3. CTASection.jsx - Line 96-99: Missing `contextSafe` on Mousemove Handler
**Lines:** 96-99  
**Issue:** Event listener cleanup only removes the handler but the handler itself isn't wrapped in `contextSafe`, so stale closures or unmount can cause errors.

```jsx
// CURRENT (lines 96-99):
const section = sectionRef.current;
section.addEventListener('mousemove', handleMouseMove);  // NOT contextSafe
return () => section.removeEventListener('mousemove', handleMouseMove);
```

**Fix Required:** Wrap `handleMouseMove` with `contextSafe` from `useGSAP({ scope: sectionRef })`.

---

### 4. Experience.jsx - Line 42-85: Timeline Uses Ref Array Before Populated
**Lines:** 42-85  
**Issue:** The entrance animation `useGSAP` (line 42) runs when `loading` changes, but `itemsRef.current` is populated during render (line 147). On first load, the ref array may be empty or stale.

```jsx
// Line 60: Uses itemsRef.current.filter(Boolean) 
// But itemsRef is populated at line 147 during render
tl.fromTo(itemsRef.current.filter(Boolean), ...)
```

**Fix Required:** Add `itemsRef.current.length > 0` check or move animation to a separate `useGSAP` with `dependencies: [experiences]` after render.

---

## 🟠 MAJOR BUGS (Should Fix)

### 5. Hero.jsx - Line 95-110: Parallax ScrollTrigger Missing `scope`
**Lines:** 95-110  
**Issue:** The parallax ScrollTrigger inside `matchMedia` is created without being scoped to the `useGSAP` context, so it won't auto-cleanup on unmount.

```jsx
// Line 98-108: ScrollTrigger created inside mm.add() but NO scope passed
gsap.to(headingRef.current, {
  scrollTrigger: {
    trigger: sectionRef.current,
    // ... config
  }
});
```

**Fix:** Pass `scope: sectionRef` to the ScrollTrigger config, or wrap in `contextSafe`.

---

### 6. Hero.jsx - Line 32-38: Subtitle Animation Missing `invalidateOnRefresh`
**Lines:** 32-38  
**Issue:** Subtitle transition animation lacks `invalidateOnRefresh`, so resize/refresh may cause incorrect start positions.

```jsx
// Line 32-38:
useGSAP(() => {
  gsap.fromTo(subtitleRef.current, { y: 40, opacity: 0, clipPath: 'inset(0 100% 0 0)' },
    { y: 0, opacity: 1, clipPath: 'inset(0 0% 0 0)', duration: 0.6, ease: 'expo.out' }
  );
}, { dependencies: [subIndex], scope: sectionRef });  // NO invalidateOnRefresh!
```

---

### 7. Hero.jsx - Line 118-142: `handleMouseEnter` Creates Inline Styles (Memory Leak Risk)
**Lines:** 118-142  
**Issue:** `handleMouseEnter` sets inline styles via `e.currentTarget.style.setProperty` on every hover. On rapid hover/unhover, these accumulate. Also, `usedHues.current` persists across unmounts.

**Fix:** Use GSAP `set()` instead of inline styles, and clean up `usedHues.current` on unmount.

---

### 8. Work.jsx - Line 76-100: `window.innerWidth` Used in Render/Animation Init (SSR Mismatch)
**Lines:** 82-85  
**Issue:** `window.innerWidth` accessed during animation initialization causes hydration mismatch and incorrect initial values on resize.

```jsx
// Lines 82-85:
clipPath: window.innerWidth < 640 ? 'none' : 'inset(0 100% 0 0)',
y: window.innerWidth < 640 ? 30 : 0,
opacity: window.innerWidth < 640 ? 0 : 1
```

**Fix:** Use `gsap.matchMedia()` or `ScrollTrigger.matchMedia()` for responsive animations, or defer to `useLayoutEffect`.

---

### 9. Work.jsx - Line 125-133: MatchMedia Check Only Runs Once
**Lines:** 125-133  
**Issue:** The `matchMedia` check for `mousemove` listener only runs once on mount. On resize from mobile to desktop (or vice versa), the listener won't be added/removed.

```jsx
// Lines 125-133:
const mq = window.matchMedia('(min-width: 1024px)');
if (mq.matches) {
  section?.addEventListener('mousemove', onMove);
}
return () => { section?.removeEventListener('mousemove', onMove); };
```

**Fix:** Add `mq.addEventListener('change', handler)` to handle resize.

---

### 10. Experience.jsx - Line 30: Ref Array Not Pre-sized
**Line:** 28: `const itemsRef = useRef([]);`  
**Issue:** `itemsRef` is initialized as empty array but accessed by index (line 147). If items render conditionally or reorder, indices may not align.

**Fix:** Initialize with known size: `useRef(Array(10).fill(null))` or use `Map`/`Set` for dynamic items.

---

### 11. Experience.jsx - Line 191-195: `panelCardsRef` Cached But Not Cleaned
**Lines:** 191-195  
**Issue:** `panelCardsRef.current` is populated via `querySelectorAll` but never cleared. If `experiences` array shrinks, stale DOM references remain.

```jsx
useEffect(() => {
  if (reelRef.current) {
    panelCardsRef.current = Array.from(reelRef.current.querySelectorAll('.experience__panel-card'));
  }
}, [experiences]);
```

**Fix:** Clear array first: `panelCardsRef.current = []` before populating.

---

### 12. Experience.jsx - Line 228: `scope: containerRef` But Animations Target `reelRef`
**Line:** 228  
**Issue:** `useGSAP` scope is `containerRef` but animations target `reelRef.current` and `panelCardsRef.current`. Cleanup won't work correctly.

```jsx
// Line 197-228:
useGSAP(() => {
  gsap.to(reelRef.current, ...);  // Targets reelRef
  // ... panelCardsRef.current
}, { dependencies: [activeIndex], scope: containerRef });  // Scope is containerRef!
```

**Fix:** Change `scope: containerRef` to `scope: reelRef` or wrap in `useGSAP({ scope: reelRef })`.

---

### 13. Education.jsx - Line 30-31: Ref Arrays Reset in useGSAP Without Dependencies
**Lines:** 28-32  
**Issue:** Ref arrays are reset inside `useGSAP` callback with `dependencies: [educationData]`, but this runs AFTER animations are created. On data change, refs are cleared then re-populated during render, but ScrollTriggers already bound to old refs.

```jsx
// Lines 28-32:
useGSAP(() => {
  itemsRef.current = [];   // Clears BEFORE animations
  nodesRef.current = [];
}, { dependencies: [educationData], scope: sectionRef });
```

**Fix:** Move ref initialization to `useEffect` with `educationData` dependency, BEFORE the animation `useGSAP`.

---

### 14. Education.jsx - Line 79-106: `itemsRef.current.forEach` But Array May Be Sparse
**Lines:** 79-106  
**Issue:** `itemsRef.current` is populated via callback refs (line 159 in return). If items render conditionally, array may have holes (`undefined` at indices). `forEach` skips holes but indices won't match data indices.

---

### 15. SkillsSection.jsx - Line 79: `ScrollTrigger.refresh()` Called in useGSAP
**Line:** 79  
**Issue:** Calling `ScrollTrigger.refresh()` inside a `useGSAP` callback can cause infinite loops or double-refresh. It's already auto-refreshed on mount.

```jsx
// Line 79:
ScrollTrigger.refresh();  // Remove this - unnecessary
```

---

### 16. About.jsx - Line 24-28: `matchMedia` Context Not Fully Utilized
**Lines:** 24-28  
**Issue:** The `mm.add()` receives an object with conditions but the cleanup relies on `ctx.revert()` which only works if animations are created WITHIN the callback using `ctx`. Currently animations are created with `gsap.from/to` directly, not via `ctx`.

```jsx
// Current:
mm.add({ isMobile: '...', isDesktop: '...' }, (ctx) => {
  const { isMobile, isDesktop } = ctx.conditions;
  gsap.from(...)  // Should be ctx.gsap.from(...) for auto-cleanup
});
```

**Fix:** Use `ctx.gsap` for all animations inside matchMedia.

---

### 17. Navbar.jsx - Line 13: `menuLinksRef` Initialized with Fixed Size but Links Are Dynamic
**Line:** 13: `const menuLinksRef = useRef(Array(5).fill(null));`  
**Issue:** Hardcoded to 5 items. If navLinks array changes length, refs will be misaligned or overflow.

**Fix:** `useRef([])` and let callback refs populate dynamically, or use `useMemo(() => Array(navLinks.length).fill(null), [navLinks.length])`.

---

### 18. Navbar.jsx - Line 19-21: `useLenis` Callback May Fire During Unmount
**Lines:** 19-21  
**Issue:** `useLenis` callback sets state (`setScrolled`). If component unmounts during scroll, this causes a state update on unmounted component.

**Fix:** Check mounted ref or use `useGSAP` with `scope` for scroll handling.

---

## 🟡 MINOR BUGS / IMPROVEMENTS

### 19. Hero.jsx - Line 144: `initialHues.current` Created on Every Render
**Line:** 144: `const initialHues = useRef('ALOK CHANDRA'.split('').map(() => Math.floor(Math.random() * 360)));`  
**Issue:** This creates new array on EVERY render (not just mount). `useRef` initializer only runs once, but the arrow function executes each render.

**Fix:** Move inside `useRef` initializer: `useRef(() => 'ALOK CHANDRA'.split('').map(...))` or use `useMemo`.

---

### 20. Work.jsx - Line 103: `ScrollTrigger.refresh()` in Animation Callback
**Line:** 103  
**Issue:** Same as SkillsSection - calling refresh inside animation callback can cause loops.

---

### 21. Experience.jsx - Line 84: `ScrollTrigger.refresh()` in Animation Callback
**Line:** 84  
**Issue:** Same issue - unnecessary refresh call inside useGSAP.

---

### 22. Education.jsx - Line 130: `ScrollTrigger.refresh()` in Animation Callback
**Line:** 130  
**Issue:** Same issue.

---

### 23. CTASection.jsx - Line 77: `ScrollTrigger.refresh()` in Animation Callback
**Line:** 77  
**Issue:** Same issue.

---

### 24. About.jsx - Line 113: `ScrollTrigger.refresh()` in Animation Callback
**Line:** 113  
**Issue:** Same issue.

---

### 25. SkillsSection.jsx - Line 44-46: Reverse Row Initial Position Hardcoded
**Lines:** 44-46  
**Issue:** `gsap.set(container, { x: -totalWidth })` assumes container is already at 0. If refreshed mid-animation, position may be wrong.

---

### 26. Footer.jsx - Line 10-15: `gsap.to(window, { scrollTo: 0 })` Requires ScrollToPlugin
**Lines:** 10-15  
**Issue:** `ScrollToPlugin` is registered in `gsapPlugins.js` but not verified. Also, `gsap.to(window, ...)` targets window which may not work with Lenis smooth scroll.

**Fix:** Use `lenis.scrollTo(0)` if Lenis is available, or verify ScrollToPlugin works with smooth scroll.

---

## 📋 RECOMMENDED FIX PRIORITY

### Phase 1 - Critical (Do First)
1. **Navbar.jsx** - Fix menu animation cleanup (lines 29-57)
2. **Work.jsx** - Fix ref array mutations during render (lines 182, 192-193)
3. **CTASection.jsx** - Add contextSafe to mousemove (lines 96-99)
4. **Experience.jsx** - Fix timeline ref timing (lines 42-85)

### Phase 2 - Major (Do Second)
5. **Hero.jsx** - Add scope to parallax ScrollTrigger (lines 95-110)
6. **Hero.jsx** - Add invalidateOnRefresh to subtitle (line 38)
7. **Hero.jsx** - Fix handleMouseEnter memory leak (lines 118-142)
8. **Work.jsx** - Fix window.innerWidth in animations (lines 82-85)
9. **Work.jsx** - Add matchMedia change listener for mousemove (lines 125-133)
10. **Experience.jsx** - Pre-size itemsRef (line 28)
11. **Experience.jsx** - Clean panelCardsRef (lines 191-195)
12. **Experience.jsx** - Fix scope mismatch (line 228)
13. **Education.jsx** - Move ref reset to useEffect (lines 28-32)
14. **SkillsSection.jsx** - Remove ScrollTrigger.refresh() (line 79)
15. **About.jsx** - Use ctx.gsap in matchMedia (lines 24-28)
16. **Navbar.jsx** - Dynamic menuLinksRef size (line 13)
17. **Navbar.jsx** - Guard useLenis callback (lines 19-21)

### Phase 3 - Minor (Do Last)
18-26. Remove all unnecessary `ScrollTrigger.refresh()` calls
27. Fix initialHues in Hero.jsx
28. Fix Footer scrollTo with Lenis

---

## 🔧 COMMON PATTERNS TO APPLY

### Pattern 1: Proper useGSAP with scope and cleanup
```jsx
const { contextSafe } = useGSAP({ scope: sectionRef });

useGSAP(() => {
  // All animations here auto-cleanup
  gsap.to(el, { ... });
  
  const handler = contextSafe((e) => { ... });
  window.addEventListener('resize', handler);
  return () => window.removeEventListener('resize', handler);
}, { dependencies: [dep], scope: sectionRef });
```

### Pattern 2: Ref Array Initialization
```jsx
// GOOD - Pre-sized
const itemsRef = useRef(Array(MAX_ITEMS).fill(null));

// GOOD - Dynamic with Map
const itemsRef = useRef(new Map());
```

### Pattern 3: MatchMedia with Context
```jsx
const mm = gsap.matchMedia();
mm.add({ isMobile: '(max-width: 639px)' }, (ctx) => {
  ctx.gsap.from(el, { ... });  // Use ctx.gsap for auto-cleanup
});
return () => mm.revert();
```

### Pattern 4: Responsive Animations
```jsx
// BAD - window.innerWidth in animation
gsap.from(el, { x: window.innerWidth < 640 ? 0 : 100 });

// GOOD - matchMedia
mm.add('(min-width: 640px)', () => {
  gsap.from(el, { x: 100 });
});
mm.add('(max-width: 639px)', () => {
  gsap.from(el, { x: 0 });
});
```

---

## ✅ VERIFICATION CHECKLIST

After fixes, verify:
- [ ] No console errors on mount/unmount/remount
- [ ] No console errors on resize (mobile ↔ desktop)
- [ ] No console errors on rapid menu open/close
- [ ] No console errors on rapid hover/unhover
- [ ] Animations restart correctly on ScrollTrigger.refresh()
- [ ] No flash of unstyled content on load
- [ ] Smooth scroll (Lenis) works with all ScrollTriggers
- [ ] Build passes: `npm run build`
