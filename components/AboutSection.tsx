"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Compass,
  Quote,
  Target,
  Bot,
  Sparkles,
  Clock,
  BookOpen,
  Network,
  Plug
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const capabilities = [
  "פיתוח תוכנה מקצה לקצה",
  "בינה מלאכותית וצ\u05f4אטבוטים",
  "אפיון וחווית משתמש (UX/UI)",
  "שירותים דיגיטליים ומערכות תפעוליות"
];

const achievements = [
  {
    icon: Bot,
    title: "רב בוט",
    text: "צ\u05f4אטבוט מבוסס בינה מלאכותית המספק מענה הלכתי וארגוני זמין בכל רגע."
  },
  {
    icon: Sparkles,
    title: "תפילון חכם",
    text: "כלי תפילה דיגיטלי חכם המותאם אישית לזמן, למקום ולצרכי המשתמש."
  },
  {
    icon: Clock,
    title: "זמני היום",
    text: "מערכת מדויקת לחישוב והצגת זמני היום ההלכתיים בכל נקודה בארץ."
  },
  {
    icon: BookOpen,
    title: "תורת המחנה",
    text: "הנגשה דיגיטלית של גופי הידע התורניים והמבצעיים לחיילי החיל."
  },
  {
    icon: Plug,
    title: "\u05deמשקי API",
    text: "תשתית ממשקים פתוחה לחיבור והזרמת מידע בין מערכות הארגון."
  },
  {
    icon: Network,
    title: "מערכות אחודות ורשתיות",
    text: "מעבר מארגון מידע מקומי לתשתית רשתית אחודה הזמינה לכלל החיל."
  }
];

const ratachPoints = [
  "מערכות המידע הינן כלי תומך למימוש משימות הרבנות הצבאית",
  "מדד האפקטיביות בתהליכי העבודה הינו הזרז לקידום תהליכי דיגיטל בארגון",
  "הצלחת מערכת נמדדת אך ורק לאחר הטמעתה – במדד השימושיות במערכת",
  "קיימים סוגים שונים של מערכות – מבצעיות, תפעוליות, חווית משתמש ועוד",
  "קיימים מגוון כלים במערכות הצה\u05f4ליות שהחיל יכול להנות מפירותיהן",
  "כבר כיום יש לחיל יכולות פנימיות משמעותיות בעולמות הפיתוח הפנים-ארגוני"
];

const goals = [
  "מעבר מארגון מידע מקומי לארגון מידע רשתי ברמה התשתיתית",
  "ארגון והנגשת הידע במטה הרבנות הצבאית ברמה האפליקטיבית",
  "בניית תשתית לפיתוח, הטמעה וקסטומיזציה למערכות תפעוליות מקומיות ולמערכות ניהול הידע",
  "בניית תשתית לאפיון וניהול תהליכים ושיתוף מידע על גבי הרשת האזרחית, כמשלים למערכות הדיגיטל הצה\u05f4ליות"
];

export default function AboutSection() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const reveals = gsap.utils.toArray<HTMLElement>("[data-about-reveal]");
      reveals.forEach((el) => {
        gsap.fromTo(
          el,
          { y: 32, opacity: 0, filter: "blur(8px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 86%"
            }
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="about"
      dir="rtl"
      className="relative w-full overflow-hidden bg-[#142111] px-5 py-24 text-[#fbfcf3] sm:px-8 sm:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(251,252,243,0.9) 1px, transparent 0)",
          backgroundSize: "22px 22px"
        }}
      />

      <div className="relative mx-auto w-full max-w-5xl">
        {/* Intro */}
        <header data-about-reveal className="mb-16 text-center sm:mb-24">
          <span className="mb-4 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.32em] text-[#fbfcf3]/55">
            <span className="h-px w-8 bg-[#fbfcf3]/35" />
            קצת עלינו
            <span className="h-px w-8 bg-[#fbfcf3]/35" />
          </span>
          <h2 className="mx-auto max-w-3xl text-balance text-3xl font-bold leading-[1.2] sm:text-5xl">
            {"תחום ניהו\u05f4ג ברבנות הצבאית"}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-[#fbfcf3]/72 sm:text-lg">
            {
              "תחום ניהו\u05f4ג הוא כבר לא רק תחום של ניהול ידע והטמעת מערכות קטנות – הוא בית תוכנה מלא, המוביל פיתוח, בינה מלאכותית, אפיון, חווית משתמש ושירותים דיגיטליים עבור חיל הרבנות הצבאית."
            }
          </p>
          <p className="mx-auto mt-5 max-w-3xl text-pretty text-sm leading-relaxed text-[#fbfcf3]/60 sm:text-base">
            {
              "התחום הוקם כדי לממש את חזון החיל להיות ארגון לומד, ופועל בתוך 'מערך תבלי\u05f4ן'. מצוות מטמיעים ומפתחים, התחום מוביל תהליכי ארגון, ניהול, הטמעה והנגשה של הידע במטה הרבנות הצבאית, ומייצר התאמה לצרכי החיל בזמן אמת."
            }
          </p>
          <ul className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-2.5">
            {capabilities.map((cap, i) => (
              <li
                key={i}
                className="rounded-full border border-[#fbfcf3]/15 bg-[#fbfcf3]/[0.06] px-4 py-2 text-[13px] font-semibold text-[#fbfcf3]/85"
              >
                {cap}
              </li>
            ))}
          </ul>
        </header>

        {/* Achievements of the past year */}
        <div data-about-reveal className="mb-16 sm:mb-24">
          <div className="mb-8 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#fbfcf3]/10 text-[#EAB308]">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-2xl font-bold sm:text-3xl">העשייה של השנה האחרונה</h3>
              <p className="mt-1 text-sm text-[#fbfcf3]/55">
                מוצרים ותשתיות שפיתחנו והשקנו עבור החיל
              </p>
            </div>
          </div>
          <ul className="grid gap-px overflow-hidden rounded-3xl bg-[#fbfcf3]/10 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.map((item, i) => {
              const Icon = item.icon;
              return (
                <li key={i} className="bg-[#142111] p-6 sm:p-7">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#fbfcf3]/10 text-[#22D3EE]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h4 className="mt-4 text-lg font-bold text-[#fbfcf3]">
                    {item.title}
                  </h4>
                  <p className="mt-2 text-[14px] leading-relaxed text-[#fbfcf3]/70">
                    {item.text}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Rat"ch */}
        <div data-about-reveal className="mb-16 sm:mb-24">
          <div className="mb-8 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#fbfcf3]/10 text-[#22D3EE]">
              <Quote className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="text-2xl font-bold sm:text-3xl">{"דבר הרת\u05f4ח"}</h3>
          </div>
          <ul className="grid gap-px overflow-hidden rounded-3xl bg-[#fbfcf3]/10 sm:grid-cols-2">
            {ratachPoints.map((point, i) => (
              <li
                key={i}
                className="flex items-start gap-3 bg-[#142111] p-6 sm:p-7"
              >
                <span className="mt-0.5 text-sm font-bold text-[#22D3EE]/80">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[15px] leading-relaxed text-[#fbfcf3]/80">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-6 sm:grid-cols-5">
          {/* Vision */}
          <div
            data-about-reveal
            className="rounded-3xl border border-[#fbfcf3]/12 bg-[#fbfcf3]/[0.04] p-8 sm:col-span-2 sm:p-10"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#fbfcf3]/10 text-[#EAB308]">
              <Compass className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="mt-6 text-2xl font-bold sm:text-3xl">חזון</h3>
            <p className="mt-4 text-pretty text-[15px] leading-relaxed text-[#fbfcf3]/75">
              {
                "תמיכה דיגיטלית בפיתוח תרבות ארגונית חיילית הכוללת שמירה והנגשה רציפה של הידע והמידע, ואיפשור פיתוח, הטמעה וקסטומיזציה פנים-ארגונית – על מנת לתמוך ביעילות, אפקטיביות, זמינות, שיתופיות, סדר וארגון, הנגשה ומיתוג של הידע והתהליכים ברבנות הצבאית."
              }
            </p>
          </div>

          {/* Goals */}
          <div
            data-about-reveal
            className="rounded-3xl border border-[#fbfcf3]/12 bg-[#fbfcf3]/[0.04] p-8 sm:col-span-3 sm:p-10"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#fbfcf3]/10 text-[#22D3EE]">
              <Target className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="mt-6 text-2xl font-bold sm:text-3xl">יעדים</h3>
            <ul className="mt-5 flex flex-col gap-4">
              {goals.map((goal, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#fbfcf3]/10 text-xs font-bold text-[#fbfcf3]/80">
                    {i + 1}
                  </span>
                  <span className="text-[15px] leading-relaxed text-[#fbfcf3]/80">
                    {goal}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
