import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
document.addEventListener("DOMContentLoaded", () => {
  console.log("animation");
  // Respect user's motion preferences
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (reduceMotion) {
    // Make everything visible and static
    gsap.utils
      .toArray(
        "[data-reveal], [data-stagger-child-b], [data-stagger-b], [data-stagger-child-t], [data-reveal-fr-l], [data-reveal-fr-r]",
      )
      .forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
    return;
  }

  // Helper to handle conditional scroll trigger callbacks
  const createScrollTrigger = (config) => {
    const runOnce = config.trigger.dataset.once === "true";

    const st = ScrollTrigger.create({
      trigger: config.trigger,
      start: config.start,
      end: config.end,
      onEnter: () => {
        const tween = config.onEnter();
        // Kill trigger after animation completes if once-only
        if (runOnce && tween) {
          tween.eventCallback("onComplete", () => st.kill());
        }
      },
      onEnterBack: runOnce ? undefined : config.onEnterBack,
      onLeave: runOnce ? undefined : config.onLeave,
    });

    return st;
  };

  // Stagger from bottom (children)
  gsap.utils.toArray("[data-stagger-child-b]").forEach((container) => {
    const items = gsap.utils.toArray(container.children);
    const distanceY = parseFloat(container.dataset.distanceY) || 50;
    const delay = parseFloat(container.dataset.delayS) || 0;

    createScrollTrigger({
      trigger: container,
      start: "top bottom",
      end: "bottom 15%",
      onEnter: () =>
        gsap.fromTo(
          items,
          { y: distanceY, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.3,
            ease: "power3.out",
            delay,
            stagger: 0.2,
          },
        ),
      onEnterBack: () =>
        gsap.fromTo(
          items,
          { y: -distanceY, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.3,
            ease: "power3.out",
            delay,
            stagger: 0.2,
          },
        ),
      onLeave: () =>
        gsap.to(items, {
          y: -distanceY,
          autoAlpha: 0,
          duration: 0.3,
          ease: "power3.in",
          delay,
          stagger: 0.2,
        }),
    });
  });

  // Stagger from bottom (container)
  gsap.utils.toArray("[data-stagger-b]").forEach((container) => {
    const distanceY = parseFloat(container.dataset.distanceY) || 50;
    const delay = parseFloat(container.dataset.delayS) || 0;

    createScrollTrigger({
      trigger: container,
      start: "top bottom",
      end: "bottom 15%",
      onEnter: () =>
        gsap.fromTo(
          container,
          { y: distanceY, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.3,
            ease: "power3.out",
            delay,
            stagger: 0.2,
          },
        ),
      onEnterBack: () =>
        gsap.fromTo(
          container,
          { y: -distanceY, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.3,
            ease: "power3.out",
            delay,
            stagger: 0.2,
          },
        ),
      onLeave: () =>
        gsap.to(container, {
          y: -distanceY,
          autoAlpha: 0,
          duration: 0.3,
          ease: "power3.in",
          delay,
          stagger: 0.2,
        }),
    });
  });

  // Stagger from top (children)
  gsap.utils.toArray("[data-stagger-child-t]").forEach((container) => {
    const items = gsap.utils.toArray(container.children);
    const distanceY = parseFloat(container.dataset.distanceY) || 50;
    const delay = parseFloat(container.dataset.delayS) || 0;

    createScrollTrigger({
      trigger: container,
      start: "top bottom",
      end: "bottom 15%",
      onEnter: () =>
        gsap.fromTo(
          items,
          { y: -distanceY, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.3,
            ease: "power3.out",
            delay,
            stagger: 0.2,
          },
        ),
      onEnterBack: () =>
        gsap.fromTo(
          items,
          { y: distanceY, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.3,
            ease: "power3.out",
            delay,
            stagger: 0.2,
          },
        ),
      onLeave: () =>
        gsap.to(items, {
          y: distanceY,
          autoAlpha: 0,
          duration: 0.3,
          ease: "power3.in",
          stagger: 0.2,
          delay,
        }),
    });
  });

  // Reveal from left (children)
  gsap.utils.toArray("[data-reveal-fr-l]").forEach((container) => {
    const items = gsap.utils.toArray(container.children);
    const distanceX = parseFloat(container.dataset.distanceX) || 50;
    const delay = parseFloat(container.dataset.delayS) || 0;

    createScrollTrigger({
      trigger: container,
      start: "top 95%",
      end: "bottom 15%",
      onEnter: () =>
        gsap.from(items, {
          x: -distanceX,
          autoAlpha: 0,
          duration: 0.3,
          ease: "power3.out",
          stagger: 0.2,
          delay,
        }),
      onEnterBack: () =>
        gsap.fromTo(
          items,
          { x: -distanceX, autoAlpha: 0 },
          {
            x: 0,
            autoAlpha: 1,
            duration: 0.3,
            ease: "power3.out",
            stagger: 0.2,
            delay,
          },
        ),
      onLeave: () =>
        gsap.to(items, {
          x: -distanceX,
          autoAlpha: 0,
          duration: 0.3,
          ease: "power3.in",
          stagger: 0.2,
          delay,
        }),
    });
  });

  // Reveal from right (children)
  gsap.utils.toArray("[data-reveal-fr-r]").forEach((container) => {
    const items = gsap.utils.toArray(container.children);
    const distanceX = parseFloat(container.dataset.distanceX) || 50;
    const delay = parseFloat(container.dataset.delayS) || 0;

    createScrollTrigger({
      trigger: container,
      start: "top 95%",
      end: "bottom 15%",
      onEnter: () =>
        gsap.fromTo(
          items,
          { x: distanceX, autoAlpha: 0 },
          {
            x: 0,
            autoAlpha: 1,
            duration: 0.3,
            ease: "power3.out",
            stagger: 0.2,
            delay,
          },
        ),
      onEnterBack: () =>
        gsap.fromTo(
          items,
          { x: -distanceX, autoAlpha: 0 },
          {
            x: 0,
            autoAlpha: 1,
            duration: 0.3,
            ease: "power3.out",
            stagger: 0.2,
            delay,
          },
        ),
      onLeave: () =>
        gsap.to(items, {
          x: distanceX,
          autoAlpha: 0,
          duration: 0.3,
          ease: "power3.in",
          stagger: 0.2,
          delay,
        }),
    });
  });

  // Custom direction reveal
  gsap.utils.toArray("[data-reveal]").forEach((container) => {
    const distanceX = parseFloat(container.dataset.distanceX) || 250;
    const distanceY = parseFloat(container.dataset.distanceY) || 250;
    const delay = parseFloat(container.dataset.delayS) || 0;
    const duration = parseFloat(container.dataset.duratonS) || 0.5;
    const direction = container.dataset.direction || "bottom-right";

    let offsetX = 0;
    let offsetY = 0;

    switch (direction) {
      case "top-right":
        offsetX = distanceX;
        offsetY = -distanceY;
        break;
      case "bottom-right":
        offsetX = distanceX;
        offsetY = distanceY;
        break;
      case "bottom-left":
        offsetX = -distanceX;
        offsetY = distanceY;
        break;
      case "top-left":
        offsetX = -distanceX;
        offsetY = -distanceY;
        break;
      case "top":
        offsetX = 0;
        offsetY = -distanceY;
        break;
      case "bottom":
        offsetX = 0;
        offsetY = distanceY;
        break;
      case "left":
        offsetX = -distanceX;
        offsetY = 0;
        break;
      case "right":
        offsetX = distanceX;
        offsetY = 0;
        break;
    }

    const fromVars = { x: offsetX, y: offsetY, autoAlpha: 0 };
    const toVars = {
      x: 0,
      y: 0,
      autoAlpha: 1,
      duration,
      ease: "power3.out",
      delay,
    };

    createScrollTrigger({
      trigger: container,
      start: "top 99%",
      end: "bottom 15%",
      onEnter: () => gsap.fromTo(container, fromVars, toVars),
      onEnterBack: runOnce
        ? undefined
        : () => gsap.fromTo(container, fromVars, toVars),
      onLeave: runOnce
        ? undefined
        : () =>
            gsap.to(container, {
              x: offsetX,
              y: offsetY,
              autoAlpha: 0,
              duration,
              ease: "power3.in",
              delay,
            }),
    });
  });
});
