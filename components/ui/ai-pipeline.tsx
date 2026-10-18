"use client";

import { useEffect, useRef } from "react";

type Stage = { enter: number; hold: number; exit: number; presence: number };

// Scroll-driven walkthrough of a RAG answer, modelled on רב בוט:
// question → tokens → a point in the knowledge space → nearest sources → streamed answer.

const QUESTION = "מה צריך לדעת לפני שבת בבסיס?";
const TOKENS = ["מה", "צריך", "לדעת", "לפני", "שבת", "בבסיס"];
const STEPS = ["שאלה", "הטמעה", "שליפה", "תשובה"];
const SOURCES = [
  { title: "תורת המחנה", note: "הלכות שבת", score: 0.94 },
  { title: "פקודות מטכ״ל", note: "שבת ומועדים", score: 0.89 },
  { title: "שו״ת הרבנות", note: "שאלות מהשטח", score: 0.83 }
];

const INK = "20, 33, 17";
const GOLD = "200, 154, 58";

type Cluster = { label: string; x: number; y: number; spread: number };
const CLUSTERS: Cluster[] = [
  { label: "תורת המחנה", x: 0.32, y: 0.34, spread: 0.09 },
  { label: "פקודות מטכ״ל", x: 0.66, y: 0.3, spread: 0.08 },
  { label: "ת״ש וזכויות", x: 0.28, y: 0.74, spread: 0.08 },
  { label: "כשרות", x: 0.68, y: 0.72, spread: 0.07 }
];
const QUERY_TARGET = { x: 0.47, y: 0.36 };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const range = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

type Dot = { x: number; y: number; r: number; phase: number; cluster: number };

function buildDots(): { dots: Dot[]; neighbours: number[] } {
  let seed = 1337;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const gauss = () => (rand() + rand() + rand() - 1.5) / 1.5;
  const dots: Dot[] = [];
  CLUSTERS.forEach((c, ci) => {
    for (let i = 0; i < 64; i++) {
      dots.push({ x: c.x + gauss() * c.spread, y: c.y + gauss() * c.spread, r: 1.6 + rand() * 1.8, phase: rand() * 6.28, cluster: ci });
    }
  });
  for (let i = 0; i < 40; i++) dots.push({ x: 0.08 + rand() * 0.84, y: 0.1 + rand() * 0.8, r: 1.2 + rand(), phase: rand() * 6.28, cluster: -1 });
  const neighbours = dots
    .map((d, i) => ({ i, d: Math.hypot(d.x - QUERY_TARGET.x, d.y - QUERY_TARGET.y) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 7)
    .map((n) => n.i);
  return { dots, neighbours };
}

const SPACE = buildDots();

export function AiPipeline({ stage }: { stage: Stage }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const holdRef = useRef(stage.hold);
  const live = stage.presence > 0.02;
  holdRef.current = stage.hold;

  const h = stage.hold;
  const typed = Math.round(QUESTION.length * ease(range(h, 0.02, 0.16)));
  const tokensIn = range(h, 0.16, 0.26);
  const tokensFly = range(h, 0.26, 0.42);
  const sourcesIn = range(h, 0.56, 0.7);
  const answerIn = range(h, 0.72, 0.98);
  const activeStep = h < 0.18 ? 0 : h < 0.44 ? 1 : h < 0.7 ? 2 : 3;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !live) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const draw = (time: number) => {
      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== Math.round(rect.width * dpr)) {
        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);
      }
      const W = rect.width;
      const H = rect.height;
      const hold = holdRef.current;
      const t = time / 1000;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const spaceIn = ease(range(hold, 0.12, 0.3));
      const query = easeInOut(range(hold, 0.3, 0.46));
      const links = range(hold, 0.44, 0.6);
      const qx = (1.02 + (QUERY_TARGET.x - 1.02) * query) * W;
      const qy = (0.12 + (QUERY_TARGET.y - 0.12) * query) * H;

      // Cluster halos and labels.
      CLUSTERS.forEach((c, ci) => {
        const highlight = ci <= 1 ? links : 0;
        ctx.globalAlpha = spaceIn * (0.05 + highlight * 0.07);
        ctx.fillStyle = `rgb(${ci <= 1 && highlight > 0 ? GOLD : INK})`;
        ctx.beginPath();
        ctx.ellipse(c.x * W, c.y * H, c.spread * W * 2.1, c.spread * H * 2.1, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = spaceIn * 0.7;
        ctx.fillStyle = `rgb(${INK})`;
        ctx.font = "600 12px 'M PLUS Rounded 1c', Assistant, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(c.label, c.x * W, (c.y + c.spread * 2.35) * H + 12);
      });

      // Knowledge points, gently breathing.
      SPACE.dots.forEach((d, i) => {
        const isNear = SPACE.neighbours.includes(i);
        const x = (d.x + Math.sin(t * 0.6 + d.phase) * 0.004) * W;
        const y = (d.y + Math.cos(t * 0.5 + d.phase) * 0.004) * H;
        const lit = isNear ? links : 0;
        ctx.globalAlpha = spaceIn * (0.28 + lit * 0.72);
        ctx.fillStyle = lit > 0.05 ? `rgb(${GOLD})` : `rgb(${INK})`;
        ctx.beginPath();
        ctx.arc(x, y, d.r * (1 + lit * 1.2), 0, Math.PI * 2);
        ctx.fill();

        if (isNear && links > 0) {
          const order = SPACE.neighbours.indexOf(i) / SPACE.neighbours.length;
          const k = clamp01((links - order * 0.5) / 0.5);
          if (k > 0) {
            ctx.globalAlpha = 0.75 * k;
            ctx.strokeStyle = `rgb(${GOLD})`;
            ctx.lineWidth = 1.3;
            ctx.beginPath();
            ctx.moveTo(qx, qy);
            ctx.lineTo(qx + (x - qx) * k, qy + (y - qy) * k);
            ctx.stroke();
          }
        }
      });

      // The question, embedded as a single point that flies in and searches.
      if (query > 0) {
        const pulse = 1 + Math.sin(t * 4) * 0.12;
        ctx.globalAlpha = 0.16 * query;
        ctx.fillStyle = `rgb(${GOLD})`;
        ctx.beginPath();
        ctx.arc(qx, qy, 26 * pulse * (0.4 + links * 0.6 + 0.4), 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = query;
        ctx.fillStyle = `rgb(${INK})`;
        ctx.beginPath();
        ctx.arc(qx, qy, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = `rgb(${GOLD})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(qx, qy, 10, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [live]);

  return (
    <div className="ai-pipe" dir="rtl">
      <div className="ai-pipe__space">
        <canvas ref={canvasRef} className="ai-pipe__canvas" aria-hidden="true" />
        <div className="ai-pipe__sources">
          {SOURCES.map((s, i) => {
            const k = ease(clamp01((sourcesIn - i * 0.18) / 0.64));
            return (
              <div
                key={s.title}
                className="ai-pipe__source"
                style={{ opacity: k, transform: `translateY(${(1 - k) * 24}px)` }}
              >
                <span className="ai-pipe__source-title">{s.title}</span>
                <span className="ai-pipe__source-note">{s.note}</span>
                <span className="ai-pipe__score">
                  <span style={{ width: `${s.score * 100 * k}%` }} />
                </span>
                <span className="ai-pipe__score-num">{(s.score * k).toFixed(2)}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="ai-pipe__chat">
        <div className="ai-pipe__chat-head">
          <span className="ai-pipe__avatar">ר</span>
          <span>רב בוט</span>
        </div>

        <div className="ai-pipe__bubble ai-pipe__bubble--user">
          {QUESTION.slice(0, typed)}
          {typed < QUESTION.length ? <span className="ai-pipe__caret" /> : null}
        </div>

        <div className="ai-pipe__tokens" aria-hidden="true">
          {TOKENS.map((tok, i) => {
            const k = clamp01((tokensIn - i * 0.1) / 0.5);
            const fly = clamp01((tokensFly - i * 0.06) / 0.6);
            return (
              <span
                key={tok}
                className="ai-pipe__token"
                style={{
                  opacity: k * (1 - fly),
                  transform: `translate(${-fly * 180}px, ${(1 - k) * 10 - fly * 70}px) scale(${1 - fly * 0.5})`
                }}
              >
                {tok}
              </span>
            );
          })}
        </div>

        <div className="ai-pipe__bubble ai-pipe__bubble--bot" style={{ opacity: answerIn > 0 ? 1 : 0 }}>
          <span className="ai-pipe__answer-lead">הנה מה שמצאתי בשלושה מקורות:</span>
          {[0.92, 0.78, 0.86, 0.54].map((w, i) => (
            <span key={i} className="ai-pipe__line" style={{ width: `${w * 100 * ease(clamp01((answerIn - 0.1 - i * 0.16) / 0.3))}%` }} />
          ))}
          <span className="ai-pipe__cites" style={{ opacity: range(answerIn, 0.7, 0.95) }}>
            {SOURCES.map((s, i) => (
              <span key={s.title} className="ai-pipe__cite">
                [{i + 1}] {s.title}
              </span>
            ))}
          </span>
        </div>
      </div>

      <ol className="ai-pipe__steps">
        {STEPS.map((label, i) => (
          <li key={label} className={i === activeStep ? "is-active" : i < activeStep ? "is-done" : ""}>
            <span className="ai-pipe__step-num">{String(i + 1).padStart(2, "0")}</span>
            {label}
          </li>
        ))}
      </ol>
    </div>
  );
}
