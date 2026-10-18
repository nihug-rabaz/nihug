"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DeployFlow } from "@/components/ui/deploy-flow";
import { CollectionSurfer, type CollectionItem } from "@/components/ui/collection-surfer";
import OrgRoofFigures from "@/components/OrgRoofFigures";
import { AppPhoneReel } from "@/components/ui/app-phone-reel";
import { AiPipeline } from "@/components/ui/ai-pipeline";
import { TrainingPath } from "@/components/ui/training-path";
import { projectsCatalog } from "@/lib/projects/ProjectsCatalog";

gsap.registerPlugin(ScrollTrigger);

type VisualName = "surfer" | "cloud" | "circuit" | "phones" | "training";

type SideHighlight = {
  label: string;
  text: string;
};

type Capability = {
  id: string;
  title: string;
  subtitle: string;
  descriptionTitle: string;
  description: string;
  visual: VisualName;
  sideEyebrow: string;
  sideHeading: string;
  sideBody: string;
  highlights: SideHighlight[];
};

type Stage = {
  enter: number;
  hold: number;
  exit: number;
  presence: number;
};

const capabilities: Capability[] = [
  {
    id: "web",
    title: "פיתוח אתרים",
    subtitle: "אתרים עם חוויית משתמש חדה, נקייה ומדויקת",
    descriptionTitle: "אתרים שמובילים לתוצאה",
    description:
      "אתרים וממשקים עם עיצוב מוקפד, תנועה עדינה, התאמה למובייל וקוד שמוכן להמשך פיתוח.",
    visual: "surfer",
    sideEyebrow: "01 · אתרים",
    sideHeading: "מהמוקאפ ועד לפרודקשן",
    sideBody:
      "אנחנו לוקחים פרויקט מהשלב הראשון — מחקר, אפיון ועיצוב — עד אתר חי שמותקן בענן ומוכן לתעבורה אמיתית.",
    highlights: [
      { label: "עיצוב", text: "אפיון UX מלא וספריית קומפוננטים" },
      { label: "טכנולוגיה", text: "Next.js, React, TypeScript, Tailwind" },
      { label: "באוויר", text: "כל מערכת עולה ב־Vercel עם דומיין משלה" }
    ]
  },
  {
    id: "cloud",
    title: "פלטפורמות שאנחנו משתמשים בהן",
    subtitle: "סט כלים מודרני שמאפשר לבנות מהר, נקי ויציב",
    descriptionTitle: "הסט הטכנולוגי שלנו",
    description:
      "כך נראה הצינור שלנו: מקומיט, דרך בנייה, ועד מערכת חיה בדומיין משלה. אלה המערכות שבאוויר היום.",
    visual: "cloud",
    sideEyebrow: "02 · כלים",
    sideHeading: "כלים שעובדים יחד",
    sideBody:
      "כל פלטפורמה שאנחנו משלבים נבחרה כי היא מהירה לפיתוח, יציבה בפרודקשן וקלה לתחזוקה לאורך זמן.",
    highlights: [
      { label: "צד לקוח", text: "React, Next.js, Tailwind, Framer Motion" },
      { label: "צד שרת", text: "Node, Firebase, Postgres, Prisma" },
      { label: "תשתית", text: "Vercel, Docker, Git, GitHub Actions" }
    ]
  },
  {
    id: "circuit",
    title: "שילובי AI",
    subtitle: "AI שמתחבר לתהליך העבודה ולא נשאר גימיק בצד",
    descriptionTitle: "AI שמשתלב בעבודה היומית",
    description:
      "עוזרים חכמים, אוטומציות, חיפוש סמנטי, חילוץ מידע ודשבורדים שמייצרים ערך אמיתי.",
    visual: "circuit",
    sideEyebrow: "03 · בינה מלאכותית",
    sideHeading: "מודלים שמבינים את הנתונים שלך",
    sideBody:
      "אנחנו בונים שכבת AI שלמה סביב המוצר — מ-LLM ועד RAG ו-Vision — בלי גימיקים, רק יכולות שמשנות את חווית המשתמש.",
    highlights: [
      { label: "מודלי שפה", text: "OpenAI, Claude, Gemini עם RAG מותאם" },
      { label: "ראייה ממוחשבת", text: "ניתוח תמונה, OCR וזיהוי אוטומטי" },
      { label: "אוטומציות", text: "צ׳אטבוטים, חילוץ מידע ודשבורדים חכמים" }
    ]
  },
  {
    id: "phones",
    title: "פיתוח אפליקציות",
    subtitle: "אפליקציות מובייל שנראות טוב ועובדות חלק בשטח",
    descriptionTitle: "אפליקציה אחת, כל הפלטפורמות",
    description:
      "אפליקציות שהחיילים פותחים בטלפון: מסידור התפילה ועד החוגר הדיגיטלי. אלה כמה מהן.",
    visual: "phones",
    sideEyebrow: "04 · אפליקציות",
    sideHeading: "iOS ו-Android בקוד אחד",
    sideBody:
      "קוד אחד שרץ על שתי הפלטפורמות — כאפליקציית PWA שמותקנת מהדפדפן או כאפליקציה בחנות — עם התראות, אחסון מקומי וסנכרון לשרת.",
    highlights: [
      { label: "טכנולוגיה", text: "React Native, Expo, PWA, TypeScript" },
      { label: "יכולות", text: "התראות, מצלמה, מיקום ואחסון מקומי" },
      { label: "הפצה", text: "App Store, Google Play והתקנה ישירה מהדפדפן" }
    ]
  },
  {
    id: "training",
    title: "תוכנית הדרכה",
    subtitle: "לכל מערכת ואפליקציה שאנחנו בונים — הדרכה מלאה",
    descriptionTitle: "הצוות שלך עובד באופן עצמאי",
    description:
      "וידאו, מדריך משתמשים, הדרכה למנהלים ומסמך תפעול. הצוות שלך עולה לאוויר עם המערכת בלי תלות בנו.",
    visual: "training",
    sideEyebrow: "05 · הדרכה",
    sideHeading: "ידע שנשאר אצלך",
    sideBody:
      "כל מערכת מגיעה עם חבילת הדרכה מותאמת — כדי שהצוות שלך יוכל להוביל את המוצר בלי להישען עלינו.",
    highlights: [
      { label: "וידאו", text: "סרטוני הדרכה קצרים לכל פיצ׳ר במערכת" },
      { label: "מסמכים", text: "מדריך משתמשים ומסמך תפעול מלא" },
      { label: "מנהלים", text: "הדרכת מנהלים על דשבורד הניהול" }
    ]
  }
];

const surferItems: CollectionItem[] = projectsCatalog.getAll().map((project, index) => ({
  id: index + 1,
  title: project.name.toUpperCase(),
  image: project.image
}));

const SCROLL_PIXELS_PER_SLOT = 2400;
const TOTAL_SCROLL_DISTANCE = SCROLL_PIXELS_PER_SLOT * capabilities.length;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const smoothStep = (value: number) => value * value * value * (value * (value * 6 - 15) + 10);

function deriveStage(sectionProgress: number, index: number, total: number): Stage {
  const span = 1 / total;
  const center = (index + 0.5) * span;
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const transitionWidth = span * 0.18;
  const holdHalf = span * 0.32;

  const fadeInBoost = isLast ? span * 0.06 : 0;
  const fadeInEnd = isFirst ? -span * 0.05 : center - holdHalf - fadeInBoost;
  const fadeInStart = fadeInEnd - transitionWidth;
  const fadeOutStart = isLast ? 1 + span * 0.05 : center + holdHalf;
  const fadeOutEnd = fadeOutStart + transitionWidth;

  const enter = clamp01((sectionProgress - fadeInStart) / Math.max(0.0001, fadeInEnd - fadeInStart));
  const exit = clamp01((sectionProgress - fadeOutStart) / Math.max(0.0001, fadeOutEnd - fadeOutStart));
  const hold = clamp01((sectionProgress - fadeInEnd) / Math.max(0.0001, fadeOutStart - fadeInEnd));
  const presence = enter * (1 - exit);

  return { enter, hold, exit, presence };
}

function GridBackground() {
  const mask =
    "radial-gradient(ellipse 72% 96% at 32% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 38%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,0) 92%)";
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage:
          "radial-gradient(circle at 1px 1px, rgba(20, 33, 17, 0.28) 1px, transparent 0)",
        backgroundSize: "20px 20px",
        WebkitMaskImage: mask,
        maskImage: mask
      }}
    />
  );
}

// The wide side fades only serve the card surfer (stage 1); `sideOpacity` follows its presence.
function StageEdgeMask({ sideOpacity }: { sideOpacity: number }) {
  return (
    <>
      <div style={{ opacity: sideOpacity }} className="pointer-events-none absolute inset-y-0 left-0 z-30 w-16 bg-gradient-to-r from-[#fbfcf3] via-[#fbfcf3]/94 to-transparent sm:w-44" />
      <div style={{ opacity: sideOpacity }} className="pointer-events-none absolute inset-y-0 right-0 z-30 w-16 bg-gradient-to-l from-[#fbfcf3] via-[#fbfcf3]/94 to-transparent sm:w-44" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-4 bg-gradient-to-b from-[#fbfcf3] to-transparent sm:h-6" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-4 bg-gradient-to-t from-[#fbfcf3] to-transparent sm:h-6" />
    </>
  );
}

function StageShell({ children, sideMask }: { children: ReactNode; sideMask: number }) {
  return (
    <div className="capability-stage-shell relative h-full w-full overflow-hidden rounded-[1.45rem] bg-[#fbfcf3] sm:rounded-[2rem]" dir="ltr">
      <GridBackground />
      <StageEdgeMask sideOpacity={sideMask} />
      {children}
    </div>
  );
}

function StageWrapper({ stage, children, interactive }: { stage: Stage; children: ReactNode; interactive: boolean; }) {
  const enterEased = smoothStep(stage.enter);
  const exitEased = smoothStep(stage.exit);
  const enterY = (1 - enterEased) * 100;
  const exitY = -exitEased * 100;
  const totalY = enterY + exitY;
  const isHidden = stage.enter <= 0.0001 || stage.exit >= 0.9999;
  const style: CSSProperties = {
    transform: `translate3d(0, ${totalY.toFixed(3)}%, 0)`,
    pointerEvents: interactive && stage.presence > 0.4 ? "auto" : "none",
    willChange: "transform",
    visibility: isHidden ? "hidden" : "visible"
  };
  return (
    <div className="absolute inset-0" style={style}>
      {children}
    </div>
  );
}

function CapabilityDescription({ capability }: { capability: Capability }) {
  return (
    <div
      className="pointer-events-none absolute left-4 right-4 top-[64px] z-30 mx-auto max-w-none text-center text-[#142111] sm:left-auto sm:right-10 sm:top-7 sm:mx-0 sm:max-w-[460px] sm:text-right lg:right-12 lg:max-w-[520px]"
      dir="rtl"
    >
      <span
        key={`cap-eyebrow-${capability.id}`}
        className="capability-fade mb-1.5 inline-flex items-center gap-2 text-[9.5px] font-bold uppercase tracking-[0.04em] text-[#142111]/55 sm:mb-2 sm:text-[12px] sm:tracking-[0.05em]"
      >
        <span className="h-px w-6 bg-[#142111]/35" />
        {capability.sideEyebrow}
      </span>
      <h3
        key={`cap-title-${capability.id}`}
        className="capability-fade mb-1 text-[16px] font-bold leading-[1.2] text-[#142111] sm:mb-2 sm:text-[22px] sm:leading-[1.25] lg:text-[24px]"
        style={{ animationDelay: "0.05s" }}
      >
        {capability.descriptionTitle}
      </h3>
      <p
        key={`cap-body-${capability.id}`}
        className="capability-fade text-[13px] font-medium leading-[1.45] text-[#142111]/72 sm:text-[18px] sm:leading-[1.55]"
        style={{ animationDelay: "0.1s" }}
      >
        {capability.description}
      </p>
    </div>
  );
}

function CapabilitySidePanel({ capability }: { capability: Capability }) {
  return (
    <aside
      className="pointer-events-none absolute right-10 z-30 hidden text-right text-[#142111] lg:right-12 lg:top-[58%] lg:block lg:w-[300px] lg:-translate-y-1/2 xl:right-12 xl:w-[330px] 2xl:right-14 2xl:w-[360px]"
      dir="rtl"
      aria-label="פרטים נוספים"
    >
      <div
        key={`side-${capability.id}`}
        className="capability-side-fade flex flex-col gap-5"
      >
        <h4 className="text-[20px] font-bold leading-[1.22] text-[#142111] xl:text-[22px]">
          {capability.sideHeading}
        </h4>

        <p className="text-[14.5px] font-medium leading-[1.62] text-[#142111]/72 xl:text-[15px]">
          {capability.sideBody}
        </p>

        <ul className="flex flex-col gap-3.5 border-t border-[#142111]/12 pt-4">
          {capability.highlights.map((item) => (
            <li key={item.label} className="flex flex-col gap-0.5 text-right">
              <span className="text-[15px] font-bold leading-tight text-[#142111] xl:text-[15.5px]">
                {item.label}
              </span>
              <span className="text-[13.5px] font-medium leading-snug text-[#142111]/65 xl:text-[14px]">
                {item.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

function SurferPreview({ holdProgress, isMobile }: { holdProgress: number; isMobile: boolean }) {
  return (
    <div className="absolute inset-0" dir="ltr">
      <CollectionSurfer
        items={surferItems}
        variant="uplift"
        progress={holdProgress}
        embedded
        showOverlay={false}
        stepX={isMobile ? 150 : 320}
        stepY={isMobile ? -16 : -28}
        stepZ={isMobile ? -150 : -260}
        cardWidth={isMobile ? 232 : 390}
        cardHeight={isMobile ? 152 : 260}
        sceneOffsetX={isMobile ? -18 : -180}
        sceneOffsetY={isMobile ? -8 : -60}
        perspectiveOrigin={isMobile ? "50% 42%" : "25% 35%"}
      />
    </div>
  );
}

function CloudPreview({ stage }: { stage: Stage }) {
  return <DeployFlow stage={stage} />;
}

function CircuitPreview({ stage }: { stage: Stage }) {
  return <AiPipeline stage={stage} />;
}

function PhonesPreview({ stage }: { stage: Stage }) {
  return <AppPhoneReel stage={stage} />;
}

function useIsMobile(query = "(max-width: 640px)") {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);
  return isMobile;
}

const MOBILE_VISUAL_SCALE: Partial<Record<VisualName, number>> = {
  cloud: 0.82,
  circuit: 0.58,
  phones: 0.56,
  training: 0.74
};

const MOBILE_VISUAL_Y: Partial<Record<VisualName, string>> = {
  circuit: "-8%",
  phones: "-6%",
  training: "-3%"
};

function VisualForCapability({ visual, stage, isMobile }: { visual: VisualName; stage: Stage; isMobile: boolean; }) {
  if (visual === "surfer") return <SurferPreview holdProgress={stage.hold} isMobile={isMobile} />;
  const inner =
    visual === "cloud" ? <CloudPreview stage={stage} /> :
    visual === "circuit" ? <CircuitPreview stage={stage} /> :
    visual === "phones" ? <PhonesPreview stage={stage} /> :
    visual === "training" ? <TrainingPath stage={stage} /> : null;
  if (!inner) return null;
  const scale = isMobile ? MOBILE_VISUAL_SCALE[visual] : undefined;
  if (scale) {
    const style = {
      "--mobile-visual-scale": scale,
      "--mobile-visual-y": MOBILE_VISUAL_Y[visual] ?? "0%"
    } as CSSProperties;
    return (
      <div className={`capability-mobile-visual capability-mobile-visual--${visual} absolute inset-0 origin-center`} style={style}>
        {inner}
      </div>
    );
  }
  return inner;
}

function TopStackNav({
  active,
  localProgress,
  setActive
}: {
  active: number;
  localProgress: number;
  setActive: (index: number) => void;
}) {
  return (
    <div className="absolute left-0 right-0 top-4 z-40 flex flex-wrap items-center justify-center gap-2 px-4 text-[#142111] sm:left-6 sm:right-auto sm:top-5 sm:max-w-[calc(100%-2rem)] sm:justify-start sm:gap-4 sm:px-0 lg:left-8 lg:top-7" dir="ltr">
      <button className="relative hidden h-10 w-10 items-center justify-center text-sm font-bold sm:flex sm:h-12 sm:w-12 sm:text-base">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
          <polygon points="50,4 88,25 88,75 50,96 12,75 12,25" fill="none" stroke="currentColor" strokeWidth="4" />
        </svg>
        {String(active + 1).padStart(2, "0")}
      </button>

      <div className="hidden min-w-[92px] sm:block sm:min-w-[116px]">
        <div className="text-[14px] font-bold leading-none tracking-[0.06em] sm:text-[17px]">{String(active + 1).padStart(2, "0")}</div>
        <div className="mt-2 h-[3px] w-20 overflow-hidden bg-[#142111]/18 sm:mt-3 sm:w-28">
          <div className="h-full bg-[#142111] transition-[width] duration-200" style={{ width: `${(localProgress * 100).toFixed(2)}%` }} />
        </div>
      </div>

      <div className="hidden text-base font-bold text-[#142111]/55 sm:block sm:text-xl">
        {active + 1} / {capabilities.length}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {capabilities.map((item, index) => {
          const isActive = index === active;
          return (
            <button key={item.id} onClick={() => setActive(index)} className="group relative h-9 w-9 text-[#142111] sm:h-12 sm:w-12" aria-label={`מעבר אל ${item.title}`}>
              <svg className={`absolute inset-0 h-full w-full transition-opacity ${isActive ? "opacity-100" : "opacity-25"}`} viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="43" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray={index % 2 ? "18 9" : "28 7"} />
                {isActive ? <path d="M50 7 A43 43 0 0 1 93 50" fill="none" stroke="currentColor" strokeWidth="5" /> : null}
              </svg>
              <span className={`absolute inset-0 flex items-center justify-center text-[11px] font-bold sm:text-sm ${isActive ? "text-[#142111]" : "text-[#142111]/35"}`}>{String(index + 1).padStart(2, "0")}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ScrollCapabilitiesSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const progressRef = useRef(0);
  const [sectionProgress, setSectionProgress] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!sectionRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: () => `+=${TOTAL_SCROLL_DISTANCE}`,
      scrub: 1.35,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const next = self.progress;
        if (Math.abs(progressRef.current - next) < 0.0012) return;
        progressRef.current = next;
        setSectionProgress(next);
      }
    });

    return () => {
      trigger.kill();
    };
  }, []);

  const stages = useMemo(
    () => capabilities.map((_, index) => deriveStage(sectionProgress, index, capabilities.length)),
    [sectionProgress]
  );

  const activeIndex = stages.reduce((bestIndex, current, idx) => (current.presence > stages[bestIndex].presence ? idx : bestIndex), 0);
  const activeStage = stages[activeIndex];

  const handleSetActive = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const targetProgress = (index + 0.5) / capabilities.length;
    const sectionTop = window.scrollY + section.getBoundingClientRect().top;
    window.scrollTo({
      top: sectionTop + TOTAL_SCROLL_DISTANCE * targetProgress,
      behavior: "smooth"
    });
  };

  return (
    <section
      ref={sectionRef}
      className="assistant-capabilities relative bg-[#fbfcf3] text-[#142111]"
      data-active={activeIndex}
      data-progress={activeStage.hold.toFixed(3)}
      dir="rtl"
      style={{ height: `calc(100svh + ${TOTAL_SCROLL_DISTANCE}px)` }}
    >
      <OrgRoofFigures />
      <div className="sticky top-0 h-[100svh] min-h-[640px] overflow-hidden">
        <TopStackNav active={activeIndex} localProgress={activeStage.hold} setActive={handleSetActive} />

        <CapabilityDescription capability={capabilities[activeIndex]} />
        <CapabilitySidePanel capability={capabilities[activeIndex]} />

        <div className="capability-stage-area absolute inset-x-0 top-[31%] bottom-[4%] flex items-center justify-center px-3 sm:top-[14%] sm:bottom-[8%] sm:px-6 lg:justify-start lg:px-10 lg:pl-12 lg:pr-[360px] xl:pl-14 xl:pr-[400px] 2xl:pr-[440px]">
          <div className="relative h-full w-full max-w-[1100px] transition-transform duration-500 lg:max-w-[820px] lg:-translate-x-[90px] xl:max-w-[900px] xl:-translate-x-[150px] 2xl:-translate-x-[200px]">
            <StageShell sideMask={stages[0].presence}>
              {capabilities.map((capability, index) => (
                <StageWrapper key={`stage-${capability.id}`} stage={stages[index]} interactive={index === activeIndex}>
                  <VisualForCapability visual={capability.visual} stage={stages[index]} isMobile={isMobile} />
                </StageWrapper>
              ))}
            </StageShell>
          </div>
        </div>
      </div>
    </section>
  );
}
