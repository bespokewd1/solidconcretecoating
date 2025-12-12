  import { gsap } from "gsap";

  export function switchTab(parentId:string,contentContainerId:string) {
    const parent = document.getElementById(
      parentId,
    ) as HTMLElement;
    if (!parent) return;

    const buttons = parent.querySelectorAll(
      "[data-tab]",
    ) as NodeListOf<HTMLButtonElement>;
    const contents = parent.querySelectorAll(
      "[data-content]",
    ) as NodeListOf<HTMLElement>;
    const contentContainer = parent.querySelector(
      contentContainerId,
    ) as HTMLElement;

    const AUTOPLAY_INTERVAL = 4000;
    const TOTAL_TABS = buttons.length;

    let autoplayTimer: ReturnType<typeof setTimeout> | null = null;
    let isInView = false;
    let isPaused = false;
    let observer: IntersectionObserver | null = null;

    // Initialize first content
    gsap.set(contents[0], { display: "block", x: 0, opacity: 1 });

    function goToTab(tab: string, skipAnimation = false) {
      const activeContent = parent.dataset.contentActive;
      if (tab === activeContent) return;

      parent.dataset.contentActive = tab;

      const currentContent = parent.querySelector(
        `[data-content="${activeContent}"]`,
      ) as HTMLElement;
      const targetContent = parent.querySelector(
        `[data-content="${tab}"]`,
      ) as HTMLElement;

      if (skipAnimation) {
        if (currentContent) gsap.set(currentContent, { display: "none" });
        if (targetContent)
          gsap.set(targetContent, { display: "block", x: 0, opacity: 1 });
      } else {
        const tl = gsap.timeline({
          onComplete: () => {
            if (currentContent) gsap.set(currentContent, { display: "none" });
          },
        });

        if (currentContent) {
          tl.to(currentContent, {
            duration: 0.3,
            x: "-100%",
            opacity: 0,
            ease: "power2.out",
          });
        }

        if (targetContent) {
          gsap.set(targetContent, { display: "block", x: "100%", opacity: 0 });
          tl.to(targetContent, {
            duration: 0.3,
            x: "0%",
            opacity: 1,
            ease: "power2.in",
          });
        }
      }

      // Update button styles
      buttons.forEach((btn) => {
        btn.style.background =
          btn.dataset.tab === tab
            ? "color-mix(in oklab, var(--color-accent) 30%, transparent) !important"
            : "var(--color-fore-light) !important";
      });
    }

    function getNextTab(): string {
      const current = parseInt(parent.dataset.contentActive || "1", 10);
      const next = current >= TOTAL_TABS ? 1 : current + 1;
      return next.toString();
    }

    function startAutoplay() {
      if (autoplayTimer || isPaused || !isInView) return;

      autoplayTimer = setTimeout(() => {
        autoplayTimer = null;
        goToTab(getNextTab());
        startAutoplay();
      }, AUTOPLAY_INTERVAL);
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearTimeout(autoplayTimer);
        autoplayTimer = null;
      }
    }

    function pauseAutoplay() {
      isPaused = true;
      stopAutoplay();
    }

    function resumeAutoplay() {
      isPaused = false;
      if (isInView) startAutoplay();
    }

    // Intersection Observer for viewport detection
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isInView = entry.isIntersecting;
          if (isInView && !isPaused) {
            startAutoplay();
          } else {
            stopAutoplay();
          }
        });
      },
      { threshold: 0.3 },
    );

    observer.observe(parent);

    // Hover/touch handlers for pause
    const handleInteractionStart = () => pauseAutoplay();
    const handleInteractionEnd = () => {
      // Delay resume slightly to avoid immediate restart
      setTimeout(resumeAutoplay, 500);
    };

    contentContainer?.addEventListener("mouseenter", handleInteractionStart);
    contentContainer?.addEventListener("mouseleave", handleInteractionEnd);
    contentContainer?.addEventListener("touchstart", handleInteractionStart, {
      passive: true,
    });
    contentContainer?.addEventListener("touchend", handleInteractionEnd, {
      passive: true,
    });

    // Button click handlers
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const tab = button.dataset.tab;
        if (!tab || tab === parent.dataset.contentActive) return;

        // Stop and reset autoplay on manual interaction
        stopAutoplay();
        isPaused = false;
        goToTab(tab);
        // Restart autoplay after manual switch
        if (isInView) startAutoplay();
      });
    });

    // Cleanup on page navigation (Astro View Transitions)
    document.addEventListener(
      "astro:before-swap",
      () => {
        stopAutoplay();
        observer?.disconnect();
        contentContainer?.removeEventListener(
          "mouseenter",
          handleInteractionStart,
        );
        contentContainer?.removeEventListener(
          "mouseleave",
          handleInteractionEnd,
        );
        contentContainer?.removeEventListener(
          "touchstart",
          handleInteractionStart,
        );
        contentContainer?.removeEventListener("touchend", handleInteractionEnd);
      },
      { once: true },
    );
  }

  document.addEventListener("astro:page-load", switchTab);
