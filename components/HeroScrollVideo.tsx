"use client";

import { useEffect, useRef, useState } from "react";
import { KnowledgeHeroOverlay } from "@/components/KnowledgeLandingHero";
import { HeroParallaxFrame } from "@/components/HeroParallaxFrame";
import { HeroVideoDialog } from "@/components/magicui/hero-video-dialog";
import { framePath } from "@/lib/heroFrames";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerLenis } from "@/lib/smoothScroll";

gsap.registerPlugin(ScrollTrigger);

/** Scroll distance for the hero pin — tuned for feel, not frame count. */
const HERO_SCROLL_PX = 4200;
const HERO_VIDEO_HOLD_PX = 900;
const TOTAL_SCROLL_PX = HERO_SCROLL_PX + HERO_VIDEO_HOLD_PX;
const HOLD_START = HERO_SCROLL_PX / TOTAL_SCROLL_PX;
const HOLD_END = 1;
const HERO_VIDEO_SCRUB = "/videos/hero-scrub.mp4";
const HERO_VIDEO_FALLBACK = "/videos/hero.mp4";
const HERO_POSTER = framePath(1);
const VIDEO_SEEK_MIN_DELTA = 1 / 30;

const remapHoldProgress = (progress: number): number => {
  if (progress <= HOLD_START) return progress / HOLD_START;
  return 1;
};

export default function HeroScrollVideo() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [displayedProgress, setDisplayedProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const isReadyRef = useRef(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const frameShellRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);
  const botStageRef = useRef<HTMLDivElement | null>(null);
  const loadingProgressRef = useRef(0);
  const lenisRef = useRef<Lenis | null>(null);
  const seekTokenRef = useRef(0);
  const pendingVideoProgressRef = useRef<number | null>(null);
  const videoSyncRafRef = useRef(0);
  const [heroVideoSrc, setHeroVideoSrc] = useState(HERO_VIDEO_SCRUB);

  useEffect(() => {
    let cancelled = false;
    fetch(HERO_VIDEO_SCRUB, { method: "HEAD" })
      .then((res) => {
        if (cancelled) return;
        if (!res.ok) setHeroVideoSrc(HERO_VIDEO_FALLBACK);
      })
      .catch(() => {
        if (!cancelled) setHeroVideoSrc(HERO_VIDEO_FALLBACK);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    loadingProgressRef.current = loadingProgress;
  }, [loadingProgress]);

  useEffect(() => {
    let rafId = 0;
    const animateCount = () => {
      setDisplayedProgress((current) => {
        const target = loadingProgressRef.current;
        if (current >= target) return current;
        const step = Math.max(1, Math.ceil((target - current) * 0.18));
        return Math.min(current + step, target);
      });
      rafId = requestAnimationFrame(animateCount);
    };
    rafId = requestAnimationFrame(animateCount);
    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const abort = new AbortController();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const noHover = window.matchMedia("(hover: none)").matches;
    const skipLenis = reduceMotion || coarsePointer || noHover;
    const previousOverflow = document.body.style.overflow;
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    let lenis: Lenis | null = null;
    let lenisTicker: ((time: number) => void) | null = null;

    if (!skipLenis) {
      lenis = new Lenis({
        lerp: 0.08,
        smoothWheel: true,
        wheelMultiplier: 0.85
      });
      lenis.stop();
      lenisRef.current = lenis;
      registerLenis(lenis);
      lenis.on("scroll", ScrollTrigger.update);

      lenisTicker = (time: number) => {
        lenis!.raf(time * 1000);
      };
      gsap.ticker.add(lenisTicker);
      gsap.ticker.lagSmoothing(0);
    } else {
      lenisRef.current = null;
      registerLenis(null);
    }

    let resizeObserver: ResizeObserver | undefined;
    let scrollTrigger: ScrollTrigger | undefined;
    let timeline: gsap.core.Timeline | undefined;

    const pushProgress = (percent: number) => {
      const next = Math.min(100, Math.max(loadingProgressRef.current, percent));
      loadingProgressRef.current = next;
      if (isMounted) setLoadingProgress(next);
    };

    const flushVideoSync = () => {
      videoSyncRafRef.current = 0;
      const progress = pendingVideoProgressRef.current;
      if (progress === null) return;
      pendingVideoProgressRef.current = null;

      const video = videoRef.current;
      if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;

      const target = Math.min(video.duration - 0.05, Math.max(0, progress * video.duration));
      if (Math.abs(video.currentTime - target) < VIDEO_SEEK_MIN_DELTA) return;

      const token = ++seekTokenRef.current;
      try {
        video.currentTime = target;
      } catch {
        /* ignore seek races while metadata settles */
      }

      const onSeeked = () => {
        if (token !== seekTokenRef.current) return;
        video.removeEventListener("seeked", onSeeked);
      };
      video.addEventListener("seeked", onSeeked);
    };

    const syncVideoTime = (progress: number) => {
      pendingVideoProgressRef.current = progress;
      if (!videoSyncRafRef.current) {
        videoSyncRafRef.current = requestAnimationFrame(flushVideoSync);
      }
    };

    const syncBotVideo = (revealProgress: number, stageVisibility: number) => {
      const section = sectionRef.current;
      if (!section) return;

      const zoomEased = gsap.parseEase("power3.out")(revealProgress);
      const veilEased = gsap.parseEase("power2.in")(revealProgress);
      const veilOpacity = (1 - veilEased) * 0.9;
      const playReady = revealProgress > 0.95 && stageVisibility >= 0.999;
      section.style.setProperty("--hero-bot-video-progress", zoomEased.toFixed(4));
      section.style.setProperty("--hero-bot-video-veil-opacity", veilOpacity.toFixed(4));
      section.style.setProperty("--hero-bot-content-opacity", veilEased.toFixed(4));
      section.style.setProperty("--hero-bot-video-visible", stageVisibility.toFixed(4));
      section.style.setProperty("--hero-bot-video-play-ready", playReady ? "1" : "0");
    };

    const applyProgress = (progress: number) => {
      const contentProgress = gsap.utils.clamp(0, 1, remapHoldProgress(progress));
      const stageVisibility = gsap.utils.clamp(0, 1, (contentProgress - 0.55) / 0.12);
      const revealProgress = gsap.utils.clamp(0, 1, (contentProgress - 0.62) / 0.28);
      syncBotVideo(revealProgress, stageVisibility);
      timeline?.progress(contentProgress);
      syncVideoTime(contentProgress);
    };

    const finishLoading = () => {
      pushProgress(100);
      window.setTimeout(() => {
        if (!isMounted || abort.signal.aborted) return;
        isReadyRef.current = true;
        setIsReady(true);
        document.body.style.overflow = previousOverflow;
        ScrollTrigger.refresh(true);
        applyProgress(scrollTrigger?.progress ?? 0);
      }, 120);
    };

    const waitForVideoReady = () =>
      new Promise<void>((resolve) => {
        const video = videoRef.current;
        if (!video) {
          resolve();
          return;
        }

        const done = () => {
          video.removeEventListener("loadedmetadata", onReady);
          resolve();
        };

        const onReady = () => {
          pushProgress(92);
          done();
        };

        if (video.readyState >= 1) {
          pushProgress(90);
          done();
          return;
        }

        video.addEventListener("loadedmetadata", onReady, { once: true });

        // Don't block the portal forever if the network is slow — enter with poster.
        window.setTimeout(() => {
          if (abort.signal.aborted) return;
          pushProgress(85);
          done();
        }, 1200);

        try {
          video.load();
        } catch {
          done();
        }
      });

    const setupScroll = () => {
      if (
        !sectionRef.current ||
        !pinRef.current ||
        !frameShellRef.current ||
        !copyRef.current ||
        !navRef.current ||
        !botStageRef.current
      ) {
        return;
      }

      scrollTrigger?.kill();
      timeline?.kill();

      const fadeTargets = [copyRef.current, navRef.current].filter(Boolean);

      gsap.set(fadeTargets, {
        autoAlpha: 1,
        y: 0,
        yPercent: 0,
        scale: 1,
        transformOrigin: "50% 18%"
      });

      gsap.set(frameShellRef.current, {
        scale: 1,
        yPercent: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        boxShadow: "0 0 0 rgba(20,33,17,0)",
        transformOrigin: "50% 50%"
      });

      gsap.set(botStageRef.current, {
        scale: 1,
        yPercent: 0,
        transformOrigin: "50% 50%"
      });

      const heroFadeEnd = 0.78;
      const heroTransitionStart = 0.92;
      const heroTransitionDuration = 1 - heroTransitionStart;

      timeline = gsap.timeline({ paused: true });
      timeline
        .to(copyRef.current, { yPercent: -9, scale: 0.68, autoAlpha: 0, duration: heroFadeEnd, ease: "none" }, 0)
        .to(navRef.current, { y: -14, scale: 0.9, autoAlpha: 0, duration: heroFadeEnd * 0.64, ease: "none" }, 0)
        .to(videoRef.current, { scale: 1.08, yPercent: -1.2, duration: 1, ease: "none" }, 0)
        .to(
          frameShellRef.current,
          {
            scale: 0.88,
            yPercent: -7,
            borderBottomLeftRadius: 44,
            borderBottomRightRadius: 44,
            boxShadow: "0 34px 90px rgba(20,33,17,0.16)",
            duration: heroTransitionDuration,
            ease: "power2.inOut"
          },
          heroTransitionStart
        )
        .to(
          botStageRef.current,
          {
            scale: 0.9,
            yPercent: -7,
            duration: heroTransitionDuration,
            ease: "power2.inOut"
          },
          heroTransitionStart
        );

      scrollTrigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: () => {
          const sectionHeight = sectionRef.current?.offsetHeight ?? window.innerHeight;
          return `+=${Math.max(1, sectionHeight - window.innerHeight)}`;
        },
        scrub: reduceMotion ? false : true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (reduceMotion || !isReadyRef.current) return;
          applyProgress(self.progress);
        },
        onLeave: () => applyProgress(1),
        onEnterBack: () => applyProgress(1),
        onLeaveBack: () => applyProgress(0)
      });

      applyProgress(0);
    };

    const simulatedProgressId = window.setInterval(() => {
      if (!isMounted || abort.signal.aborted || isReadyRef.current) return;
      const simulated = Math.min(80, loadingProgressRef.current + 2);
      pushProgress(simulated);
    }, 40);

    const initExperience = async () => {
      pushProgress(8);
      setupScroll();
      await waitForVideoReady();
      if (!isMounted || abort.signal.aborted) return;

      await Promise.race([
        document.fonts.ready,
        new Promise<void>((resolve) => window.setTimeout(resolve, 800))
      ]);

      window.scrollTo(0, 0);
      if (lenis) {
        lenis.scrollTo(0, { immediate: true, force: true });
      }
      setupScroll();
      ScrollTrigger.refresh(true);
      lenis?.start();
      applyProgress(0);
      finishLoading();
    };

    void initExperience();

    const handleResize = () => {
      ScrollTrigger.refresh(true);
      if (isReadyRef.current) applyProgress(scrollTrigger?.progress ?? 0);
    };

    resizeObserver = new ResizeObserver(handleResize);
    if (pinRef.current) resizeObserver.observe(pinRef.current);
    if (sectionRef.current) resizeObserver.observe(sectionRef.current);
    window.addEventListener("resize", handleResize);

    return () => {
      isMounted = false;
      abort.abort();
      window.clearInterval(simulatedProgressId);
      document.body.style.overflow = previousOverflow;
      if (videoSyncRafRef.current) cancelAnimationFrame(videoSyncRafRef.current);
      if (lenisTicker) gsap.ticker.remove(lenisTicker);
      lenis?.destroy();
      lenisRef.current = null;
      registerLenis(null);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", handleResize);
      scrollTrigger?.kill();
      timeline?.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="hero-scroll relative bg-[var(--color-canvas-ice)] text-[var(--color-adaline-ink)]"
      style={{ height: `calc(100svh + ${TOTAL_SCROLL_PX}px)` }}
      dir="rtl"
    >
      <div ref={pinRef} className="hero-pin sticky top-0 h-[100svh] w-full overflow-hidden">
        <div ref={frameShellRef} className="hero-frame-shell" aria-hidden="true">
          <div className="hero-mist-overlay pointer-events-none absolute inset-0 z-[2]" />
          <HeroParallaxFrame>
            <video
              ref={videoRef}
              className="hero-canvas pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
              src={heroVideoSrc}
              poster={HERO_POSTER}
              muted
              playsInline
              preload="metadata"
              onError={() => {
                if (heroVideoSrc !== HERO_VIDEO_FALLBACK) setHeroVideoSrc(HERO_VIDEO_FALLBACK);
              }}
              // Scrubbed by scroll — never autoplay as a timeline video.
              // eslint-disable-next-line jsx-a11y/media-has-caption
            />
          </HeroParallaxFrame>
        </div>

        <div ref={botStageRef} className="hero-bot-video-stage">
          <div className="hero-bot-video-veil" aria-hidden="true" />
          <div className="hero-bot-video-content">
            <div className="hero-bot-label">
              <p className="hero-bot-label__title">הפרוייקט של היום:</p>
              <img
                className="hero-bot-label__logo"
                src="/images/ravbot-logo.png"
                alt="RavBot"
                width={1024}
                height={1024}
              />
            </div>
            <div className="hero-bot-video-dialog">
              {isReady ? (
                <HeroVideoDialog
                  animationStyle="top-in-bottom-out"
                  videoSrc="/videos/rav-bot-lite.mp4"
                  thumbnailSrc="/videos/rav-bot-poster.jpg"
                  thumbnailAlt="Rav bot video"
                />
              ) : null}
            </div>
          </div>
        </div>

        <div className="pointer-events-none relative z-20 h-full w-full">
          <div ref={copyRef} className="hero-copy hero-knowledge-copy h-full w-full origin-top">
            <KnowledgeHeroOverlay navRef={navRef} isReady={isReady} />
          </div>
        </div>
      </div>

      <div
        className={`loader-screen bg-[var(--color-canvas-ice)] transition-transform duration-700 ease-[cubic-bezier(.76,0,.24,1)] ${isReady ? "-translate-y-full" : "translate-y-0"}`}
        aria-hidden={isReady}
      >
        <div className="absolute bottom-8 left-8 text-[var(--color-adaline-ink)] sm:bottom-10 sm:left-10">
          <div className="text-[3rem] font-light leading-none tracking-[-0.05em] sm:text-[4.5rem]">
            {Math.max(displayedProgress, loadingProgress)}
          </div>
          <div className="mt-3 h-px w-40 overflow-hidden bg-[var(--color-stone-moss)]">
            <span
              className="block h-full bg-[var(--color-valley-green)] transition-[width] duration-300"
              style={{ width: `${Math.max(displayedProgress, loadingProgress)}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
