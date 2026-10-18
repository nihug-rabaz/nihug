"use client";

import { useEffect, useRef, useState } from "react";
import { projectsCatalog } from "@/lib/projects/ProjectsCatalog";

type Stage = { enter: number; hold: number; exit: number; presence: number };

// A ring of phones that turns with scroll. Each phone runs one of our real apps;
// the phone at the front scrolls through its screen while it is in focus.
const APP_IDS = ["tefilon", "rabanut-360", "hoger", "shchakim"];
const APPS = APP_IDS.map((id) => projectsCatalog.getAll().find((p) => p.id === id)).filter(
  (p): p is NonNullable<typeof p> => Boolean(p)
);

// An arc rather than a full ring, so the neighbouring phones stay in view behind the front one.
const STEP_DEG = 38;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Within each app's slice of the scroll: turn the ring (first 30%), then scroll the screen.
function ringPosition(hold: number) {
  const slice = clamp01(hold) * APPS.length;
  const current = Math.min(APPS.length - 1, Math.floor(slice));
  const local = slice - current;
  const turnLocal = current === 0 ? 1 : easeInOut(clamp01(local / 0.3));
  const turn = current === 0 ? 0 : current - 1 + turnLocal;
  const scroll = easeInOut(clamp01((local - 0.3) / 0.62));
  // Phones already shown stay scrolled down; phones not reached yet start at the top.
  const scrollFor = (i: number) => (i < current ? 1 : i > current ? 0 : scroll);
  const active = turnLocal < 0.5 ? current - 1 : current;
  return { turn, active: Math.max(0, active), scrollFor };
}

export function AppPhoneReel({ stage }: { stage: Stage }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const rootRef = useRef<HTMLDivElement | null>(null);
  const { turn, active, scrollFor } = ringPosition(stage.hold);
  const app = APPS[active];

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      setTilt({ x: ((e.clientY - r.top) / r.height - 0.5) * -8, y: ((e.clientX - r.left) / r.width - 0.5) * 12 });
    };
    const onLeave = () => setTilt({ x: 0, y: 0 });
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    return () => {
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={rootRef} className="phone-reel" dir="rtl">
      <div className="phone-reel__scene">
        <div
          className="phone-reel__ring"
          style={{
            transform: `translateZ(calc(var(--ring-radius) * -1)) rotateX(${(-6 + tilt.x).toFixed(2)}deg) rotateY(${(-turn * STEP_DEG + tilt.y).toFixed(2)}deg)`
          }}
        >
          {APPS.map((p, i) => {
            const isFront = i === active;
            return (
              <div
                key={p.id}
                className={`phone-reel__phone${isFront ? " is-front" : ""}`}
                style={{ transform: `rotateY(${i * STEP_DEG}deg) translateZ(var(--ring-radius))` }}
              >
                <div className="phone-reel__screen">
                  {/* object-position pans through whatever is below the fold; single-screen shots stay still. */}
                  <img
                    src={`/projects/${p.id}-screen.webp`}
                    alt={isFront ? `מסך מתוך ${p.name}` : ""}
                    className="phone-reel__shot"
                    style={{ objectPosition: `50% ${(scrollFor(i) * 100).toFixed(2)}%` }}
                    loading="lazy"
                  />
                </div>
                <span className="phone-reel__island" aria-hidden="true" />
              </div>
            );
          })}
        </div>
        <div className="phone-reel__floor" aria-hidden="true" />
      </div>

      <div className="phone-reel__caption">
        <div key={app.id} className="phone-reel__caption-inner">
          <span className="phone-reel__count" dir="ltr">
            {String(active + 1).padStart(2, "0")} / {String(APPS.length).padStart(2, "0")}
          </span>
          <h4 className="phone-reel__name">{app.name}</h4>
          <p className="phone-reel__tagline">{app.tagline}</p>
          <ul className="phone-reel__tags">
            {app.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </div>
        <ol className="phone-reel__dots" aria-hidden="true">
          {APPS.map((p, i) => (
            <li key={p.id} className={i === active ? "is-active" : ""} />
          ))}
        </ol>
      </div>
    </div>
  );
}
