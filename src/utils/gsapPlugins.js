import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Flip,
  Observer,
  ScrollTrigger,
  ScrollToPlugin,
  TextPlugin,
  MotionPathPlugin,
  Draggable
} from "gsap/all";

// Club GSAP plugins – these require a GSAP Club license.
// They'll be imported but may not resolve without proper license config.
let SplitText, ScrollSmoother, DrawSVGPlugin, MorphSVGPlugin,
    ScrambleTextPlugin, InertiaPlugin, CustomEase, CustomBounce,
    CustomWiggle, RoughEase, ExpoScaleEase, SlowMo,
    GSDevTools, MotionPathHelper, Physics2DPlugin, PhysicsPropsPlugin,
    EaselPlugin, PixiPlugin;

try {
  ({ SplitText } = await import("gsap/SplitText"));
} catch(e) { /* SplitText not available */ }

try {
  ({ ScrollSmoother } = await import("gsap/ScrollSmoother"));
} catch(e) { /* ScrollSmoother not available */ }

try {
  ({ DrawSVGPlugin } = await import("gsap/DrawSVGPlugin"));
} catch(e) { /* DrawSVGPlugin not available */ }

try {
  ({ ScrambleTextPlugin } = await import("gsap/ScrambleTextPlugin"));
} catch(e) { /* ScrambleTextPlugin not available */ }

try {
  ({ CustomEase } = await import("gsap/CustomEase"));
} catch(e) { /* CustomEase not available */ }

try {
  ({ CustomBounce } = await import("gsap/CustomBounce"));
} catch(e) { /* CustomBounce not available */ }

try {
  ({ CustomWiggle } = await import("gsap/CustomWiggle"));
} catch(e) { /* CustomWiggle not available */ }

try {
  const easePack = await import("gsap/EasePack");
  RoughEase = easePack.RoughEase;
  ExpoScaleEase = easePack.ExpoScaleEase;
  SlowMo = easePack.SlowMo;
} catch(e) { /* EasePack not available */ }

try {
  ({ MorphSVGPlugin } = await import("gsap/MorphSVGPlugin"));
} catch(e) { /* MorphSVGPlugin not available */ }

try {
  ({ InertiaPlugin } = await import("gsap/InertiaPlugin"));
} catch(e) { /* InertiaPlugin not available */ }

try {
  ({ GSDevTools } = await import("gsap/GSDevTools"));
} catch(e) { /* GSDevTools not available */ }

try {
  ({ MotionPathHelper } = await import("gsap/MotionPathHelper"));
} catch(e) { /* MotionPathHelper not available */ }

try {
  ({ Physics2DPlugin } = await import("gsap/Physics2DPlugin"));
} catch(e) { /* Physics2DPlugin not available */ }

try {
  ({ PhysicsPropsPlugin } = await import("gsap/PhysicsPropsPlugin"));
} catch(e) { /* PhysicsPropsPlugin not available */ }

try {
  ({ EaselPlugin } = await import("gsap/EaselPlugin"));
} catch(e) { /* EaselPlugin not available */ }

try {
  ({ PixiPlugin } = await import("gsap/PixiPlugin"));
} catch(e) { /* PixiPlugin not available */ }

// Register all available plugins (NOTE: useGSAP is a React hook, NOT a GSAP plugin — do not register it here)
// eslint-disable-next-line react-hooks/rules-of-hooks
gsap.registerPlugin(
  Flip, Observer, ScrollTrigger, ScrollToPlugin,
  TextPlugin, MotionPathPlugin, Draggable,
  SplitText, ScrollSmoother, DrawSVGPlugin, MorphSVGPlugin,
  ScrambleTextPlugin, InertiaPlugin, CustomEase, CustomBounce,
  CustomWiggle, RoughEase, ExpoScaleEase, SlowMo,
  GSDevTools, MotionPathHelper, Physics2DPlugin, PhysicsPropsPlugin,
  EaselPlugin, PixiPlugin
);

export {
  gsap, useGSAP, Flip, Observer, ScrollTrigger, ScrollToPlugin,
  TextPlugin, MotionPathPlugin, Draggable,
  SplitText, ScrollSmoother, DrawSVGPlugin, MorphSVGPlugin,
  ScrambleTextPlugin, InertiaPlugin, CustomEase, CustomBounce,
  CustomWiggle, RoughEase, ExpoScaleEase, SlowMo,
  GSDevTools, MotionPathHelper, Physics2DPlugin, PhysicsPropsPlugin,
  EaselPlugin, PixiPlugin
};
