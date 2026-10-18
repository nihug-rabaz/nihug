"use client";

type Stage = { enter: number; hold: number; exit: number; presence: number };

// Our real production systems on Vercel (name, domain, framework), streamed through commit → build → live.
type Deploy = { name: string; domain: string; framework: "Next.js" | "Vite" | "Express" };

const DEPLOYS: Deploy[] = [
  { name: "רב בוט", domain: "chat.ravbot.co.il", framework: "Next.js" },
  { name: "ניהול משימות", domain: "etur.rabaz.co.il", framework: "Next.js" },
  { name: "תרחית", domain: "tarahit.vercel.app", framework: "Next.js" },
  { name: "מא״ל", domain: "maal.rabaz.co.il", framework: "Next.js" },
  { name: "הבורר", domain: "haborer.rabaz.co.il", framework: "Next.js" },
  { name: "מולקולה בוט", domain: "molecule.rabaz.co.il", framework: "Next.js" },
  { name: "תפילון", domain: "sidur.rabaz.co.il", framework: "Next.js" },
  { name: "אמי״ר 2.0", domain: "amir.rabaz.co.il", framework: "Next.js" },
  { name: "שח״ר", domain: "shahar.rabaz.co.il", framework: "Next.js" },
  { name: "רבנות 360", domain: "rabaz360-app.vercel.app", framework: "Vite" },
  { name: "טופס 246", domain: "246.rabaz.co.il", framework: "Next.js" },
  { name: "איתור קציני דת", domain: "agam.rabaz.co.il", framework: "Next.js" },
  { name: "להקת הרבנות", domain: "kolkore.vercel.app", framework: "Next.js" },
  { name: "זמני היום", domain: "times.rabaz.co.il", framework: "Next.js" },
  { name: "שתי הלכות", domain: "2halachot.vercel.app", framework: "Next.js" },
  { name: "שחקים", domain: "shchakim-connect.rabaz.co.il", framework: "Next.js" },
  { name: "תאג״דים וחמ״ל", domain: "orfi.rabaz.co.il", framework: "Express" },
  { name: "מכירת חמץ", domain: "pesach.rabaz.co.il", framework: "Next.js" },
  { name: "מורשת הרבנות", domain: "moreshet.rabaz.co.il", framework: "Next.js" },
  { name: "פיקוד מנצח", domain: "pikod.rabaz.co.il", framework: "Next.js" }
];

const FRAMEWORKS = (["Next.js", "Vite", "Express"] as const).map((fw) => ({
  name: fw,
  count: DEPLOYS.filter((d) => d.framework === fw).length
}));

const LANES = [
  { id: "commit", label: "קומיט" },
  { id: "build", label: "בנייה" },
  { id: "live", label: "באוויר" }
] as const;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const SPAN = 0.16;
const startOf = (i: number) => 0.02 + (i / DEPLOYS.length) * 0.8;
const FEED_SIZE = 7;

export function DeployFlow({ stage }: { stage: Stage }) {
  const h = stage.hold;
  const phases = DEPLOYS.map((d, i) => ({ d, i, p: clamp01((h - startOf(i)) / SPAN) }));
  const inCommit = phases.filter((x) => x.p > 0 && x.p < 0.34);
  const inBuild = phases.filter((x) => x.p >= 0.34 && x.p < 1);
  const live = phases.filter((x) => x.p >= 1).reverse();

  return (
    <div className="deploy-flow" dir="rtl">
      <div className="deploy-flow__lanes">
        {LANES.map((lane) => (
          <section key={lane.id} className={`deploy-lane deploy-lane--${lane.id}`}>
            <header className="deploy-lane__head">
              <span className="deploy-lane__label">{lane.label}</span>
              {lane.id === "live" ? (
                <span className="deploy-lane__count" dir="ltr">
                  {live.length} / {DEPLOYS.length}
                </span>
              ) : null}
            </header>

            <div className="deploy-lane__body">
              {lane.id === "commit"
                ? inCommit.map(({ d, p }) => (
                    <div key={d.domain} className="deploy-chip" style={{ opacity: Math.min(1, p / 0.08), transform: `translateY(${(1 - Math.min(1, p / 0.1)) * 14}px)` }}>
                      <span className="deploy-chip__name">{d.name}</span>
                      <span className="deploy-chip__meta" dir="ltr">git push · main</span>
                    </div>
                  ))
                : null}

              {lane.id === "build"
                ? inBuild.map(({ d, p }) => {
                    const k = (p - 0.34) / 0.66;
                    return (
                      <div key={d.domain} className="deploy-chip deploy-chip--building">
                        <span className="deploy-chip__name">{d.name}</span>
                        <span className="deploy-chip__meta" dir="ltr">
                          {d.framework} · building
                        </span>
                        <span className="deploy-chip__bar">
                          <span style={{ width: `${k * 100}%` }} />
                        </span>
                      </div>
                    );
                  })
                : null}

              {lane.id === "live"
                ? live.slice(0, FEED_SIZE).map(({ d }, idx) => (
                    <div key={d.domain} className="deploy-chip deploy-chip--live" style={{ opacity: 1 - idx * 0.11 }}>
                      <span className="deploy-chip__dot" aria-hidden="true" />
                      <span className="deploy-chip__name">{d.name}</span>
                      <span className="deploy-chip__meta" dir="ltr">
                        {d.domain}
                      </span>
                    </div>
                  ))
                : null}
            </div>
          </section>
        ))}
      </div>

      <footer className="deploy-flow__stack">
        <span className="deploy-flow__stack-title">על מה זה רץ</span>
        <div className="deploy-flow__bar" dir="ltr">
          {FRAMEWORKS.map((fw) => (
            <span key={fw.name} className={`deploy-flow__seg deploy-flow__seg--${fw.name.replace(".", "").toLowerCase()}`} style={{ flexGrow: fw.count }} />
          ))}
        </div>
        <ul className="deploy-flow__legend">
          {FRAMEWORKS.map((fw) => (
            <li key={fw.name}>
              <span className={`deploy-flow__swatch deploy-flow__seg--${fw.name.replace(".", "").toLowerCase()}`} />
              <span dir="ltr">{fw.name}</span> · {fw.count}
            </li>
          ))}
          <li className="deploy-flow__legend-note">כולן מתארחות ב־Vercel</li>
        </ul>
      </footer>
    </div>
  );
}
