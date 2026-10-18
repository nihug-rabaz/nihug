"use client";

import { useEffect, useRef, useState } from "react";

type Stage = { enter: number; hold: number; exit: number; presence: number };

// A path draws itself with scroll; each milestone it reaches brings a training deliverable to life.
const VIEW_W = 800;
const VIEW_H = 520;
// A snake down the middle; milestones sit on its outer turns, so cards placed outside never cover the path.
const ANCHORS = [
  { x: 400, y: 30 },
  { x: 520, y: 110 },
  { x: 280, y: 210 },
  { x: 520, y: 310 },
  { x: 280, y: 410 }
];
const PATH =
  "M400 30 C480 30 520 70 520 110 C520 170 280 150 280 210 C280 270 520 250 520 310 " +
  "C520 370 280 350 280 410 C280 460 360 495 400 505";

const MILESTONES = [
  { id: "guide", title: "מדריך משתמשים" },
  { id: "video", title: "סרטוני הסבר" },
  { id: "managers", title: "הדרכת מנהלים" },
  { id: "ops", title: "מסמך תפעול" }
];
const OPS_ITEMS = ["גיבוי והתאוששות", "ניהול הרשאות", "טיפול בתקלות", "עדכוני גרסה"];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const range = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

export function TrainingPath({ stage }: { stage: Stage }) {
  const pathRef = useRef<SVGPathElement | null>(null);
  const [geo, setGeo] = useState<{ length: number; fractions: number[] } | null>(null);
  const progress = ease(range(stage.hold, 0.02, 0.9));

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const length = path.getTotalLength();
    const samples = Array.from({ length: 600 }, (_, i) => {
      const pt = path.getPointAtLength((length * i) / 599);
      return { f: i / 599, x: pt.x, y: pt.y };
    });
    const fractions = ANCHORS.slice(1).map((a) =>
      samples.reduce((best, s) => (Math.hypot(s.x - a.x, s.y - a.y) < Math.hypot(best.x - a.x, best.y - a.y) ? s : best)).f
    );
    setGeo({ length, fractions });
  }, []);

  const traveler = (() => {
    const path = pathRef.current;
    if (!path || !geo) return { x: ANCHORS[0].x, y: ANCHORS[0].y };
    const pt = path.getPointAtLength(geo.length * progress);
    return { x: pt.x, y: pt.y };
  })();

  const localFor = (i: number) => (geo ? range(progress, geo.fractions[i] - 0.015, Math.min(1, geo.fractions[i] + 0.16)) : 0);

  return (
    <div className="train-path" dir="rtl">
      <div className="train-path__frame">
      <svg className="train-path__svg" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <path d={PATH} className="train-path__track" />
        <path
          ref={pathRef}
          d={PATH}
          className="train-path__line"
          pathLength={1}
          style={{ strokeDasharray: 1, strokeDashoffset: 1 - progress }}
        />
        {ANCHORS.slice(1).map((a, i) => {
          const k = localFor(i);
          return (
            <g key={i} transform={`translate(${a.x} ${a.y})`}>
              <circle r={14} className="train-path__node-ring" style={{ opacity: 0.25 + k * 0.75 }} />
              <circle r={14 * ease(k)} className="train-path__node-fill" />
              <text className="train-path__node-num" y={4.5} style={{ fill: k > 0.5 ? "#fbfcf3" : "#142111" }}>
                {String(i + 1).padStart(2, "0")}
              </text>
            </g>
          );
        })}
        <g transform={`translate(${traveler.x} ${traveler.y})`} style={{ opacity: progress > 0.002 && progress < 0.995 ? 1 : 0 }}>
          <circle r={18} className="train-path__pulse" />
          <circle r={6} className="train-path__traveler" />
        </g>
      </svg>

      {MILESTONES.map((m, i) => {
        const k = localFor(i);
        const a = ANCHORS[i + 1];
        const side = i % 2 === 0 ? "right" : "left";
        return (
          <div
            key={m.id}
            className={`train-card train-card--${m.id} train-card--${side}`}
            style={{
              left: `${(a.x / VIEW_W) * 100}%`,
              top: `${(a.y / VIEW_H) * 100}%`,
              opacity: ease(range(k, 0, 0.35)),
              transform: `translate(${side === "left" ? "calc(-100% - 26px)" : "26px"}, -50%) translateY(${(1 - ease(range(k, 0, 0.35))) * 14}px)`
            }}
          >
            <span className="train-card__title">{m.title}</span>
            {m.id === "guide" ? (
              <div className="train-card__doc">
                {[0.9, 0.72, 0.84, 0.6, 0.78].map((w, j) => (
                  <span key={j} style={{ width: `${w * 100 * ease(range(k, 0.2 + j * 0.12, 0.42 + j * 0.12))}%` }} />
                ))}
              </div>
            ) : null}
            {m.id === "video" ? (
              <div className="train-card__video">
                <div className="train-card__screen">
                  <span className="train-card__play" style={{ opacity: 1 - range(k, 0.3, 0.45) }} />
                  <span className="train-card__wave">
                    {Array.from({ length: 18 }, (_, j) => (
                      <i key={j} style={{ height: `${20 + Math.abs(Math.sin(j * 1.7 + k * 9)) * 70 * range(k, 0.35, 0.5)}%` }} />
                    ))}
                  </span>
                </div>
                <span className="train-card__bar">
                  <span style={{ width: `${range(k, 0.35, 1) * 100}%` }} />
                </span>
              </div>
            ) : null}
            {m.id === "managers" ? (
              <div className="train-card__chart">
                {[0.42, 0.66, 0.5, 0.82, 0.7, 0.94].map((v, j) => (
                  <span key={j} style={{ height: `${v * 100 * ease(range(k, 0.2 + j * 0.08, 0.5 + j * 0.08))}%` }} />
                ))}
              </div>
            ) : null}
            {m.id === "ops" ? (
              <ul className="train-card__checks">
                {OPS_ITEMS.map((item, j) => {
                  const done = range(k, 0.25 + j * 0.15, 0.37 + j * 0.15);
                  return (
                    <li key={item} className={done >= 1 ? "is-done" : ""}>
                      <svg viewBox="0 0 16 16" aria-hidden="true">
                        <rect x="1" y="1" width="14" height="14" rx="4" />
                        <path d="M4.5 8.5 7 11 11.5 5.5" pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 1 - done }} />
                      </svg>
                      {item}
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        );
      })}
      </div>
    </div>
  );
}
