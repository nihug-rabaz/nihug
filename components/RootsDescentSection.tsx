"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RootSystem, soilMaskUrl, soilWave, type Root } from "@/lib/roots/RootSystem";

gsap.registerPlugin(ScrollTrigger);

const LOGO_SRC = "/hero-frames/logo2.webp";
const PIN_SCREENS = 11;
const WORLD_SCREENS = 4.2;
const STRATA = ["sand", "clay", "loam", "deep"] as const;
// Roots and the headline flip from dark-on-light to light-on-dark at this soil layer.
const FLIP_LAYER = 2;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const range = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
const easeInOut = (t: number) => 0.5 - Math.cos(Math.PI * t) / 2;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Pulse = { root: number; s: number; speed: number; size: number };

function glowSprite(rgb: string, size = 64): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, `rgba(${rgb},1)`);
  grad.addColorStop(0.25, `rgba(${rgb},0.55)`);
  grad.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

class RootsRenderer {
  private ctx: CanvasRenderingContext2D;
  private system!: RootSystem;
  private cumulative: number[][] = [];
  private pulses: Pulse[] = [];
  private pulseRoots: number[] = [];
  private width = 0;
  private height = 0;
  private dpr = 1;
  private edge = 120;
  private lastTime = 0;
  private mouse = { x: -9999, y: -9999, on: false };
  private readonly sap = glowSprite("255,196,110");
  private readonly tip = glowSprite("255,232,180");
  private readonly lantern = glowSprite("255,214,150", 128);

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly strata: HTMLElement[]
  ) {
    this.ctx = canvas.getContext("2d")!;
  }

  resize(): void {
    this.edge = parseFloat(getComputedStyle(this.strata[0]).getPropertyValue("--edge-px")) || 120;
    const rect = this.canvas.getBoundingClientRect();
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = Math.round(rect.width * this.dpr);
    this.canvas.height = Math.round(rect.height * this.dpr);
    this.system = new RootSystem(rect.width, rect.height * WORLD_SCREENS, rect.height);
    this.cumulative = this.system.roots.map((root) => {
      const cum = [0];
      for (let i = 1; i < root.pts.length; i++) {
        cum.push(cum[i - 1] + Math.hypot(root.pts[i].x - root.pts[i - 1].x, root.pts[i].y - root.pts[i - 1].y));
      }
      return cum;
    });
    this.pulseRoots = this.system.roots.map((r, i) => (r.depth <= 2 && r.length > 160 ? i : -1)).filter((i) => i >= 0);
    const pulseCount = this.width < 720 ? 40 : 90;
    this.pulses = Array.from({ length: pulseCount }, () => this.spawnPulse(true));
  }

  setMouse(x: number, y: number, on: boolean): void {
    this.mouse = { x, y, on };
  }

  // Screen-space y of a soil layer's wavy top edge at screen x.
  soilEdge(layer: number, x: number, tops: number[], edge: number): number {
    return tops[layer] + edge * soilWave(x / this.width, layer);
  }

  readStrata(): { tops: number[]; edge: number } {
    const base = this.canvas.getBoundingClientRect().top;
    const tops = this.strata.map((el) => el.getBoundingClientRect().top - base);
    return { tops, edge: this.edge };
  }

  camera(p: number): number {
    return (this.system.worldHeight - this.height) * easeInOut(range(p, 0.3, 0.86));
  }

  private front(p: number, cam: number): number {
    const reach = lerp(0, 0.92, easeOut(range(p, 0.02, 0.3)));
    const base = (cam + this.height * reach) / (this.system.worldHeight * 1.18);
    return lerp(base, this.system.maxStamp + 0.01, easeInOut(range(p, 0.8, 0.92)));
  }

  private spawnPulse(randomStart: boolean): Pulse {
    const root = this.pulseRoots[Math.floor(Math.random() * this.pulseRoots.length)] ?? 0;
    const len = this.system.roots[root]?.length ?? 1;
    return { root, s: randomStart ? Math.random() * len : 0, speed: 70 + Math.random() * 110, size: 10 + Math.random() * 12 };
  }

  render(p: number, time: number): void {
    const { ctx, system } = this;
    if (!system) return;
    const dt = Math.min(0.05, this.lastTime ? (time - this.lastTime) / 1000 : 0);
    this.lastTime = time;

    const { tops, edge } = this.readStrata();
    const cam = this.camera(p);
    const front = this.front(p, cam);
    const parallaxX = this.mouse.on ? (this.mouse.x / this.width - 0.5) * -10 : 0;

    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.width, this.height);

    this.drawPebbles(cam, tops, edge);

    ctx.save();
    ctx.translate(parallaxX, -cam);
    const grown = this.drawRoots(front, cam, tops, edge);
    ctx.restore();

    ctx.save();
    ctx.translate(parallaxX, 0);
    ctx.globalCompositeOperation = "lighter";
    this.drawTips(grown, cam, tops, edge);
    this.drawPulses(grown, cam, tops, edge, dt);
    this.drawCore(p, cam);
    ctx.restore();

    if (this.mouse.on && this.mouse.y > this.soilEdge(3, this.mouse.x, tops, edge)) {
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = 0.11;
      ctx.drawImage(this.lantern, this.mouse.x - 260, this.mouse.y - 260, 520, 520);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    }
  }

  private drawPebbles(cam: number, tops: number[], edge: number): void {
    const { ctx } = this;
    for (const peb of this.system.pebbles) {
      const y = peb.y - cam * peb.parallax;
      if (y < -20 || y > this.height + 20) continue;
      if (y < this.soilEdge(3, peb.x, tops, edge) + 6) continue;
      const dark = peb.tone < 0.5;
      ctx.fillStyle = dark ? "rgba(14, 9, 5, 0.55)" : "rgba(122, 88, 52, 0.42)";
      ctx.beginPath();
      ctx.ellipse(peb.x, y, peb.rx, peb.ry, peb.rot, 0, Math.PI * 2);
      ctx.fill();
      if (peb.rx > 5) {
        ctx.fillStyle = "rgba(214, 178, 128, 0.12)";
        ctx.beginPath();
        ctx.ellipse(peb.x - peb.rx * 0.25, y - peb.ry * 0.3, peb.rx * 0.45, peb.ry * 0.3, peb.rot, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Returns, per root, how far along (in px) it has grown — used by pulses and tips.
  private drawRoots(front: number, cam: number, tops: number[], edge: number): number[] {
    const { ctx } = this;
    const grown: number[] = new Array(this.system.roots.length).fill(0);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    this.system.roots.forEach((root, ri) => {
      const pts = root.pts;
      if (pts.length < 2 || pts[0].b > front) return;
      const cum = this.cumulative[ri];
      let last = 0;
      while (last + 1 < pts.length && pts[last + 1].b <= front) last++;
      let tailX = pts[last].x;
      let tailY = pts[last].y;
      grown[ri] = cum[last];
      if (last + 1 < pts.length) {
        const a = pts[last];
        const b = pts[last + 1];
        const t = clamp01((front - a.b) / Math.max(1e-6, b.b - a.b));
        tailX = a.x + (b.x - a.x) * t;
        tailY = a.y + (b.y - a.y) * t;
        grown[ri] = cum[last] + (cum[last + 1] - cum[last]) * t;
      }

      // Chunk the polyline so width tapers and colour can flip where the soil swallows it.
      const drawChunk = (from: number, to: number, withTail: boolean) => {
        const mid = pts[Math.min(to, from + 2)];
        const sy = mid.y - cam;
        if (sy < -60 || sy > this.height + 60) return;
        const deep = sy > this.soilEdge(FLIP_LAYER, mid.x, tops, edge);
        const w = mid.w;
        ctx.beginPath();
        ctx.moveTo(pts[from].x, pts[from].y);
        for (let i = from + 1; i <= to; i++) ctx.lineTo(pts[i].x, pts[i].y);
        if (withTail) ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = deep ? "#dcc192" : "#3a2716";
        ctx.lineWidth = w;
        ctx.stroke();
        if (w > 2.2) {
          ctx.save();
          ctx.translate(-w * 0.2, -w * 0.12);
          ctx.strokeStyle = deep ? "rgba(255, 244, 218, 0.55)" : "rgba(160, 120, 80, 0.45)";
          ctx.lineWidth = w * 0.32;
          ctx.stroke();
          ctx.restore();
        }
      };

      if (last === 0) drawChunk(0, 0, true);
      for (let from = 0; from < last; from += 5) {
        const to = Math.min(last, from + 5);
        drawChunk(from, to, to === last);
      }
    });
    return grown;
  }

  private pointAt(ri: number, s: number): { x: number; y: number } {
    const pts = this.system.roots[ri].pts;
    const cum = this.cumulative[ri];
    let i = 1;
    while (i < cum.length - 1 && cum[i] < s) i++;
    const t = clamp01((s - cum[i - 1]) / Math.max(1e-6, cum[i] - cum[i - 1]));
    return { x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * t, y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * t };
  }

  private drawTips(grown: number[], cam: number, tops: number[], edge: number): void {
    const { ctx } = this;
    this.system.roots.forEach((root, ri) => {
      if (root.depth > 3 || grown[ri] <= 0 || grown[ri] >= root.length - 1) return;
      const pt = this.pointAt(ri, grown[ri]);
      const sy = pt.y - cam;
      if (sy < -20 || sy > this.height + 20 || sy < this.soilEdge(FLIP_LAYER, pt.x, tops, edge)) return;
      const r = 9 + (3 - root.depth) * 3;
      ctx.globalAlpha = 0.5;
      ctx.drawImage(this.tip, pt.x - r, sy - r, r * 2, r * 2);
    });
    ctx.globalAlpha = 1;
  }

  private drawPulses(grown: number[], cam: number, tops: number[], edge: number, dt: number): void {
    const { ctx } = this;
    this.pulses.forEach((pulse, idx) => {
      pulse.s += pulse.speed * dt;
      if (pulse.s >= grown[pulse.root]) {
        this.pulses[idx] = this.spawnPulse(false);
        return;
      }
      const pt = this.pointAt(pulse.root, pulse.s);
      const sy = pt.y - cam;
      if (sy < -20 || sy > this.height + 20 || sy < this.soilEdge(FLIP_LAYER, pt.x, tops, edge)) return;
      const life = Math.min(1, pulse.s / 60) * Math.min(1, (grown[pulse.root] - pulse.s) / 60);
      ctx.globalAlpha = 0.85 * life;
      ctx.drawImage(this.sap, pt.x - pulse.size / 2, sy - pulse.size / 2, pulse.size, pulse.size);
    });
    ctx.globalAlpha = 1;
  }

  private drawCore(p: number, cam: number): void {
    const glow = easeOut(range(p, 0.74, 0.9));
    if (glow <= 0) return;
    const { ctx } = this;
    const { x, y } = this.system.core;
    const sy = y - cam;
    const breathe = 1 + Math.sin(this.lastTime / 700) * 0.06;
    const r = Math.min(this.width, this.height) * 0.42 * glow * breathe;
    ctx.globalAlpha = 0.55 * glow;
    ctx.drawImage(this.sap, x - r, sy - r, r * 2, r * 2);
    ctx.globalAlpha = 1;
  }
}

class RootDiveController {
  private ctx: gsap.Context | null = null;
  private renderer: RootsRenderer | null = null;
  private timeline: gsap.core.Timeline | null = null;
  private raf = 0;
  private running = false;
  private observer: IntersectionObserver | null = null;
  private cleanups: Array<() => void> = [];
  private section: HTMLElement | null = null;

  mount(section: HTMLElement, reduceMotion: boolean): void {
    this.section = section;
    const canvas = section.querySelector<HTMLCanvasElement>(".roots__canvas");
    const strata = Array.from(section.querySelectorAll<HTMLElement>(".roots__stratum"));
    if (!canvas || strata.length !== STRATA.length) return;

    this.renderer = new RootsRenderer(canvas, strata);
    this.renderer.resize();

    if (reduceMotion) {
      section.classList.add("roots--static");
      requestAnimationFrame(() => this.renderer?.render(1, performance.now()));
      return;
    }

    this.ctx = gsap.context(() => this.buildTimeline(section), section);
    this.bindPointer(section);
    this.bindResize();

    this.observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? this.start() : this.stop()));
    this.observer.observe(section);
  }

  private buildTimeline(section: HTMLElement): void {
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${window.innerHeight * PIN_SCREENS}`,
        scrub: 1.2,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });
    this.timeline = tl;

    // Soil layers rise one after another and swallow the light page.
    STRATA.forEach((_, i) => {
      tl.fromTo(
        `.roots__stratum--${i}`,
        // y: 0 drops the CSS pre-hydration offset GSAP folds in from `translate`.
        { yPercent: 100, y: 0 },
        { yPercent: 0, y: 0, duration: 16, ease: "power2.inOut" },
        8 + i * 3
      );
    });

    tl.fromTo(
      ".roots__headline .roots__char",
      { yPercent: 110, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 7, ease: "power3.out", stagger: 0.12 },
      2
    );
    tl.to(".roots__headline", { yPercent: -60, autoAlpha: 0, duration: 8, ease: "power2.in" }, 38);
    tl.fromTo(".roots__vignette", { opacity: 0 }, { opacity: 1, duration: 12 }, 30);

    tl.fromTo(".roots__aside", { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 6, ease: "power2.out" }, 52);
    tl.to(".roots__aside", { autoAlpha: 0, y: -40, duration: 6, ease: "power2.in" }, 64);

    tl.fromTo(
      ".roots__logo",
      { autoAlpha: 0, scale: 0.55, filter: "blur(12px)" },
      { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 9, ease: "power3.out" },
      80
    );
    tl.fromTo(".roots__logo-note", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 5, ease: "power2.out" }, 84);
    tl.to(".roots__logo-note", { autoAlpha: 0, duration: 3 }, 90);
    tl.to(".roots__logo", { scale: 0.6, y: () => window.innerHeight * 0.08, duration: 7, ease: "power2.inOut" }, 90);
    tl.fromTo(".roots__card", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 7, ease: "power3.out" }, 91);
    tl.to({}, { duration: 2 }, 98);
  }

  private bindPointer(section: HTMLElement): void {
    const onMove = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      this.renderer?.setMouse(e.clientX - rect.left, e.clientY - rect.top, true);
    };
    const onLeave = () => this.renderer?.setMouse(-9999, -9999, false);
    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    this.cleanups.push(() => {
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
    });
  }

  private bindResize(): void {
    let id = 0;
    const onResize = () => {
      window.clearTimeout(id);
      id = window.setTimeout(() => this.renderer?.resize(), 180);
    };
    window.addEventListener("resize", onResize);
    this.cleanups.push(() => window.removeEventListener("resize", onResize));
  }

  // The headline is split along the clay/loam edge: dark above the soil, cream below it.
  private clipHeadline(): void {
    const section = this.section;
    const light = section?.querySelector<HTMLElement>(".roots__headline--light");
    const dark = section?.querySelector<HTMLElement>(".roots__headline--dark");
    if (!this.renderer || !section || !light || !dark) return;
    const { tops, edge } = this.renderer.readStrata();
    const box = light.getBoundingClientRect();
    const base = section.getBoundingClientRect().top;
    const steps = 28;
    const wave: string[] = [];
    for (let i = 0; i <= steps; i++) {
      const lx = (box.width * i) / steps;
      const y = this.renderer.soilEdge(FLIP_LAYER, box.left + lx, tops, edge) - (box.top - base);
      wave.push(`${lx.toFixed(1)}px ${y.toFixed(1)}px`);
    }
    light.style.clipPath = `polygon(${wave.join(",")}, ${box.width}px ${box.height + 400}px, 0px ${box.height + 400}px)`;
    dark.style.clipPath = `polygon(0px -400px, ${box.width}px -400px, ${[...wave].reverse().join(",")})`;
  }

  private start(): void {
    if (this.running) return;
    this.running = true;
    const tick = (time: number) => {
      if (!this.running) return;
      const p = this.timeline?.progress() ?? 0;
      this.renderer?.render(p, time);
      this.clipHeadline();
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  private stop(): void {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  destroy(): void {
    this.stop();
    this.observer?.disconnect();
    this.cleanups.forEach((fn) => fn());
    this.cleanups = [];
    this.ctx?.revert();
    this.ctx = null;
    this.timeline = null;
    this.renderer = null;
    this.section = null;
  }
}

function SplitLine({ text }: { text: string }) {
  return (
    <span className="roots__line" aria-hidden="true">
      {Array.from(text).map((ch, i) => (
        <span key={i} className="roots__char">
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}

const HEADLINE = ["אנחנו יורדים לשורש", "העניין בכל פרויקט"];

export default function RootsDescentSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const controller = new RootDiveController();
    controller.mount(section, reduceMotion);
    return () => controller.destroy();
  }, []);

  return (
    <section ref={sectionRef} className="roots" dir="rtl" aria-label="יורדים לשורש העניין">
      {STRATA.map((name, i) => (
        <div
          key={name}
          className={`roots__stratum roots__stratum--${i} roots__stratum--${name}`}
          style={{ ["--mask" as string]: soilMaskUrl(i) }}
          aria-hidden="true"
        />
      ))}

      <canvas className="roots__canvas" aria-hidden="true" />

      <h2 className="roots__headline-wrap">
        <span className="sr-only">{HEADLINE.join(" ")}</span>
        <span className="roots__headline roots__headline--dark" aria-hidden="true">
          {HEADLINE.map((line) => (
            <SplitLine key={line} text={line} />
          ))}
        </span>
        <span className="roots__headline roots__headline--light" aria-hidden="true">
          {HEADLINE.map((line) => (
            <SplitLine key={line} text={line} />
          ))}
        </span>
      </h2>

      <p className="roots__aside">עוד קצת…</p>

      <div className="roots__logo-wrap">
        <img className="roots__logo" src={LOGO_SRC} alt="הלוגו של תחום ניהול הידע" />
        <p className="roots__logo-note">אגב, זה הלוגו שלנו</p>
      </div>

      <div className="roots__vignette" aria-hidden="true" />

      <footer className="roots__card">
        <h2 className="roots__bigtext">
          <span>ביצוע מהשורש</span>
          <span>זה אנחנו</span>
        </h2>
        <div className="roots__credit">
          <span>© 2026 הרבנות הצבאית — כל הזכויות שמורות</span>
          <span className="roots__tag">לשורש · לעומק · לאמת</span>
        </div>
      </footer>
    </section>
  );
}
