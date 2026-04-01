/**
 * animationHelpers.js
 * Shared GSAP animation presets for the portfolio.
 * All effects are device-aware via gsap.matchMedia():
 *  - Mobile (< 640px): entrance only, small y, no parallax
 *  - Tablet (640–1024px): entrance + mild parallax
 *  - Desktop (> 1024px): full effects
 */
import { gsap, ScrollTrigger } from './gsapPlugins.js';

/**
 * Fade an element up from below on scroll enter.
 * Automatically reduces y on smaller screens.
 */
export function fadeUp(el, { delay = 0, duration = 0.9, ease = 'expo.out', trigger = el } = {}) {
  if (!el) return;
  const mm = gsap.matchMedia();
  mm.add({
    isMobile: '(max-width: 639px)',
    isDesktop: '(min-width: 640px)',
  }, (ctx) => {
    const { isMobile } = ctx.conditions;
    gsap.from(el, {
      y: isMobile ? 24 : 60,
      opacity: 0,
      duration,
      delay,
      ease,
      scrollTrigger: {
        trigger,
        start: 'top 88%',
      },
    });
  });
}

/**
 * Stagger-reveal a list of elements on scroll enter.
 * Automatically reduces y + stagger amount on mobile.
 */
export function staggerReveal(
  els,
  {
    delay = 0,
    stagger = 0.1,
    y = 50,
    ease = 'power3.out',
    duration = 0.8,
    trigger,
    start = 'top 85%',
  } = {}
) {
  const validEls = Array.from(els).filter(Boolean);
  if (!validEls.length) return;
  const refTrigger = trigger || validEls[0];

  const mm = gsap.matchMedia();
  mm.add({
    isMobile: '(max-width: 639px)',
    isDesktop: '(min-width: 640px)',
  }, (ctx) => {
    const { isMobile } = ctx.conditions;
    gsap.from(validEls, {
      y: isMobile ? Math.min(y, 24) : y,
      opacity: 0,
      duration,
      stagger: isMobile ? Math.min(stagger, 0.06) : stagger,
      delay,
      ease,
      scrollTrigger: {
        trigger: refTrigger,
        start,
      },
    });
  });
}

/**
 * Clip-path wipe reveal (left to right) on scroll enter.
 * Works well for rows and headings.
 */
export function clipWipe(el, { delay = 0, duration = 0.9, ease = 'expo.out', trigger = el } = {}) {
  if (!el) return;
  gsap.fromTo(
    el,
    { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
    {
      clipPath: 'inset(0 0% 0 0)',
      duration,
      delay,
      ease,
      scrollTrigger: {
        trigger,
        start: 'top 88%',
      },
    }
  );
}

/**
 * Draw a horizontal rule from left to right.
 */
export function drawLine(el, { delay = 0, duration = 0.7, trigger = el } = {}) {
  if (!el) return;
  gsap.from(el, {
    scaleX: 0,
    transformOrigin: 'left',
    duration,
    delay,
    ease: 'power3.inOut',
    scrollTrigger: {
      trigger,
      start: 'top 88%',
    },
  });
}

/**
 * Scrubbed parallax — DESKTOP ONLY (>= 1024px).
 * No-op on mobile/tablet.
 */
export function scrubParallax(el, { yAmount = 80, trigger, start = 'top bottom', end = 'bottom top', scrub = 1.5 } = {}) {
  if (!el) return;
  const mm = gsap.matchMedia();
  mm.add('(min-width: 1024px)', () => {
    gsap.to(el, {
      y: yAmount,
      ease: 'none',
      scrollTrigger: {
        trigger: trigger || el,
        start,
        end,
        scrub,
      },
    });
  });
}

/**
 * Letter-spacing collapse — DESKTOP ONLY (>= 1024px).
 * Animates from wide spacing to tight on scroll enter.
 */
export function spacingCollapse(el, { from = '0.25em', to = '0.02em', delay = 0, duration = 1, trigger = el } = {}) {
  if (!el) return;
  const mm = gsap.matchMedia();
  mm.add('(min-width: 1024px)', () => {
    gsap.fromTo(
      el,
      { letterSpacing: from },
      {
        letterSpacing: to,
        duration,
        delay,
        ease: 'expo.out',
        scrollTrigger: {
          trigger,
          start: 'top 80%',
        },
      }
    );
  });
}
