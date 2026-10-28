import Link from "next/link";

export default function PortalHeader() {
  return (
    <header className="portal-header">
      <div className="portal-header__inner">
        <Link className="portal-header__brand" href="/">
          <span className="portal-header__brand-main">הרבנות הצבאית</span>
          <span className="portal-header__brand-sub">פורטל המערכות</span>
        </Link>
        <nav className="portal-header__nav" aria-label="ניווט פורטל">
          <a href="#systems">מערכות</a>
          <a href="#contact">יצירת קשר</a>
          <Link href="/nihug">חוויית NIHUG</Link>
        </nav>
      </div>
    </header>
  );
}
