import Link from "next/link";
import { projectsCatalog } from "@/lib/projects/ProjectsCatalog";

function getLiveSystemsCount(): number {
  return projectsCatalog.getAll().filter((project) => Boolean(project.url)).length;
}

export default function PortalHero() {
  const liveCount = getLiveSystemsCount();

  return (
    <section className="portal-hero" aria-labelledby="portal-hero-title">
      <div className="portal-hero__inner">
        <p className="portal-hero__eyebrow">פורטל דיגיטלי · הרבנות הצבאית</p>
        <h1 id="portal-hero-title" className="knowledge-title portal-hero__title">
          <span>כל המערכות והשירותים</span>
          <span>של הרבנות הצבאית במקום אחד</span>
        </h1>
        <p className="portal-hero__lead">
          גישה מהירה למערכות החיות — חיפוש, סינון לפי תחום, וקישור ישיר לכל מוצר.
        </p>
        <div className="portal-hero__actions">
          <a className="portal-hero__cta portal-hero__cta--primary" href="#systems">
            לרשימת המערכות
          </a>
          <Link className="portal-hero__cta portal-hero__cta--ghost" href="/nihug">
            החוויה הקולנועית המלאה
          </Link>
        </div>
        <dl className="portal-hero__stats">
          <div>
            <dt>מערכות חיות</dt>
            <dd>{liveCount}</dd>
          </div>
          <div>
            <dt>זמן המתנה</dt>
            <dd>0</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
