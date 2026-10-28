"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { MouseEvent, Ref } from "react";
import { MusicPlayer } from "@/components/ui/music-player";
import { scrollToSection } from "@/lib/smoothScroll";

const projects = [
  {
    name: "מרכז הפרט",
    logo: "/project-logos/merkaz-haprat.png",
    className: "project-font-frank"
  },
  {
    name: "תכלית",
    logo: "/project-logos/tachlit.png",
    className: "project-font-rubik"
  },
  {
    name: "חיזו״ק",
    logo: "/project-logos/chizuk.png",
    className: "project-font-secular"
  },
  {
    name: "הזות״י",
    logo: "/project-logos/hazuti.png",
    className: "project-font-varela"
  },
  {
    name: "לומדים",
    logo: "/project-logos/lomdim.png",
    className: "project-font-alef"
  }
];

const carouselItems = [...projects, ...projects, ...projects, ...projects];

function KnowledgeHeroBrand({ onLogoClick }: { onLogoClick?: () => void }) {
  return (
    <div className="knowledge-hero-brand-pair">
      <div className="knowledge-hero-brand knowledge-hero-brand--static" aria-label="רבנות צבאית">
        <Image src="/logo-rabbanut.png" alt="סמל הרבנות הצבאית" width={52} height={52} priority />
        <span>רבנות צבאית</span>
      </div>
      <button
        className="knowledge-hero-brand"
        type="button"
        aria-label="תחום ניהו״ג — פתח נגן מוזיקה"
        onClick={onLogoClick}
      >
        <Image src="/logo-nihug.png" alt="סמל תחום ניהו״ג" width={52} height={52} priority />
        <span>תחום ניהו״ג</span>
      </button>
    </div>
  );
}

function KnowledgeHeroNav({
  navRef,
  onLogoClick
}: {
  navRef?: Ref<HTMLElement>;
  onLogoClick?: () => void;
}) {
  const pathname = usePathname();
  const onNihugPage = pathname?.startsWith("/nihug");

  const goTo = (target: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    scrollToSection(target);
  };

  const goToPortalTab = (target: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const id = target.replace(/^#/, "");
    window.location.hash = id;
  };

  return (
    <header ref={navRef} className="knowledge-hero-nav">
      {onNihugPage ? (
        <nav className="knowledge-hero-tabs" aria-label="ניווט ראשי">
          <Link href="/">פורטל</Link>
          <a href="#work" onClick={goTo("#work")}>
            פרויקטים
          </a>
          <a href="#branches" onClick={goTo("#branches")}>
            ענפים
          </a>
          <a href="#structure" onClick={goTo("#structure")}>
            מבנה
          </a>
        </nav>
      ) : (
        <nav className="knowledge-hero-tabs knowledge-hero-tabs--spacer" aria-hidden="true" />
      )}

      <KnowledgeHeroBrand onLogoClick={onLogoClick} />
    </header>
  );
}

function HeroLogoMusicReveal({ isOpen }: { isOpen: boolean }) {
  return (
    <div className={`hero-logo-music-shell ${isOpen ? "is-open" : ""}`}>
      <MusicPlayer
        src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        coverArt="/logo-nihug.png"
        className="w-full max-w-sm"
      />
    </div>
  );
}

function KnowledgeHeroCopy() {
  const pathname = usePathname();
  const onNihugPage = pathname?.startsWith("/nihug");

  return (
    <div className="knowledge-hero-copy">
      <h1 className="knowledge-title">
        {onNihugPage ? (
          <>
            <span>הכירו את תחום ניהול הידע</span>
            <span>ויכולתה ברבנות הצבאית</span>
          </>
        ) : (
          <>
            <span>רבנות צבאית</span>
            <span>פורטל המערכות והאפליקציות</span>
          </>
        )}
      </h1>
      <p>{onNihugPage ? "תיק הפרויקטים שלנו" : "גישה מהירה לכל המערכות של תחום ניהו״ג"}</p>
    </div>
  );
}

function ProjectLogoMarquee() {
  return (
    <div className="project-logo-marquee" aria-label="פרויקטים">
      <div className="project-logo-track">
        {carouselItems.map((project, index) => (
          <article className={`project-logo-item ${project.className}`} key={`${project.name}-${index}`}>
            <div className="project-logo-mark">
              <Image src={project.logo} alt="" width={96} height={96} unoptimized />
            </div>
            <span>{project.name}</span>
          </article>
        ))}
      </div>
    </div>
  );
}

export function KnowledgeHeroOverlay({
  navRef,
  isReady = true
}: {
  navRef?: Ref<HTMLElement>;
  isReady?: boolean;
}) {
  const [isMusicOpen, setIsMusicOpen] = useState(false);

  return (
    <div className={`knowledge-hero knowledge-hero--overlay ${isReady ? "knowledge-hero--ready" : ""}`} dir="rtl" aria-label="תחום ניהול הידע">
      <KnowledgeHeroNav navRef={navRef} onLogoClick={() => setIsMusicOpen((current) => !current)} />
      <HeroLogoMusicReveal isOpen={isMusicOpen} />
      <KnowledgeHeroCopy />
      <ProjectLogoMarquee />
    </div>
  );
}

export default function KnowledgeLandingHero() {
  const [isMusicOpen, setIsMusicOpen] = useState(false);

  return (
    <section className="knowledge-hero knowledge-hero--ready" dir="rtl" aria-label="תחום ניהול הידע">
      <KnowledgeHeroNav onLogoClick={() => setIsMusicOpen((current) => !current)} />
      <HeroLogoMusicReveal isOpen={isMusicOpen} />
      <KnowledgeHeroCopy />
      <ProjectLogoMarquee />
    </section>
  );
}

