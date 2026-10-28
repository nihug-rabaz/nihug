"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PORTAL_TABS, hashToPortalTab, type PortalTabId } from "@/lib/portalTabs";

type PortalSiteNavProps = {
  variant: "top" | "bottom";
};

export default function PortalSiteNav({ variant }: PortalSiteNavProps) {
  const [active, setActive] = useState<PortalTabId>("systems");
  const size = variant === "top" ? 42 : 36;

  useEffect(() => {
    const sync = () => setActive(hashToPortalTab(window.location.hash || "#systems"));
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  return (
    <div className={`portal-site-nav portal-site-nav--${variant}`} dir="rtl">
      <div className="portal-site-nav__inner">
        <Link
          className="portal-site-nav__brand portal-site-nav__brand--rabbanut"
          href="/#systems"
          aria-label="רבנות צבאית — דף הבית"
        >
          <Image
            src="/logo-rabbanut.png"
            alt="סמל הרבנות הצבאית"
            width={size}
            height={size}
            className="portal-site-nav__logo"
            priority={variant === "top"}
          />
          <span className="portal-site-nav__brand-text">
            <strong>רבנות צבאית</strong>
            <span>פורטל המערכות</span>
          </span>
        </Link>

        <nav className="portal-site-nav__links" aria-label={variant === "top" ? "ניווט ראשי" : "ניווט תחתון"}>
          <Link href="/#home" className="portal-site-nav__link">
            בית
          </Link>
          {PORTAL_TABS.map((tab) => (
            <a
              key={tab.id}
              href={`#${tab.id}`}
              className={`portal-site-nav__link${active === tab.id ? " is-active" : ""}`}
            >
              {tab.label}
            </a>
          ))}
        </nav>

        <Link
          className="portal-site-nav__brand portal-site-nav__brand--domain"
          href="/#about"
          aria-label="תחום ניהו״ג"
        >
          <Image
            src="/logo-nihug.png"
            alt="סמל תחום ניהו״ג"
            width={size}
            height={size}
            className="portal-site-nav__logo"
            priority={variant === "top"}
          />
          <span className="portal-site-nav__brand-text">
            <strong>תחום ניהו״ג</strong>
            <span>ניהול הידע</span>
          </span>
        </Link>
      </div>
    </div>
  );
}
