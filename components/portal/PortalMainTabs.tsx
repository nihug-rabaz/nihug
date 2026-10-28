"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import PortalContact from "@/components/portal/PortalContact";
import PortalSystemsGrid from "@/components/portal/PortalSystemsGrid";
import { ProjectShowcaseCard } from "@/components/projects/ProjectShowcaseCard";
import { projectsCatalog } from "@/lib/projects/ProjectsCatalog";
import {
  PORTAL_TABS,
  hashToPortalTab,
  type PortalTabId
} from "@/lib/portalTabs";
import { scrollToSection } from "@/lib/smoothScroll";

const panelLoading = (
  <div className="portal-tabs__loading" aria-hidden="true">
    <div className="portal-tabs__loading-bar" />
  </div>
);

const ScrollCapabilitiesSection = dynamic(() => import("@/components/ScrollCapabilitiesSection"), {
  ssr: false,
  loading: () => panelLoading
});

const AboutSection = dynamic(() => import("@/components/AboutSection"), {
  ssr: false,
  loading: () => panelLoading
});

const BranchesShowcaseSection = dynamic(() => import("@/components/BranchesShowcaseSection"), {
  ssr: false,
  loading: () => panelLoading
});

function PortalWorkGrid() {
  const allProjects = useMemo(() => projectsCatalog.getAll(), []);

  return (
    <section id="work" className="portal-systems portal-systems--work" aria-labelledby="portal-work-title">
      <div className="portal-systems__inner">
        <header className="portal-systems__header">
          <h2 id="portal-work-title" className="knowledge-title portal-systems__title">
            <span>תיק</span>
            <span>עבודות</span>
          </h2>
          <p className="portal-systems__lead">
            כל הפרויקטים והמערכות שפיתח תחום ניהול הידע — מחקר, פילוטים ומערכות בשימוש.
          </p>
        </header>

        <div className="portal-systems-grid">
          {allProjects.map((project, index) => (
            <ProjectShowcaseCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function readInitialTab(): PortalTabId {
  if (typeof window === "undefined") return "systems";
  const hash = window.location.hash;
  return hash ? hashToPortalTab(hash) : "systems";
}

export default function PortalMainTabs() {
  const [activeTab, setActiveTab] = useState<PortalTabId>(readInitialTab);
  const [visited, setVisited] = useState<Set<PortalTabId>>(() => new Set([readInitialTab()]));

  const markVisited = useCallback((tab: PortalTabId) => {
    setVisited((current) => {
      if (current.has(tab)) return current;
      const next = new Set(current);
      next.add(tab);
      return next;
    });
  }, []);

  const applyTab = useCallback(
    (tab: PortalTabId, options?: { scroll?: boolean }) => {
      setActiveTab(tab);
      markVisited(tab);
      if (options?.scroll) {
        requestAnimationFrame(() => scrollToSection(`#${tab}`));
      }
    },
    [markVisited]
  );

  useEffect(() => {
    const syncFromHash = (scroll: boolean) => {
      const hash = window.location.hash;
      if (!hash) {
        applyTab("systems", { scroll: false });
        return;
      }
      if (hash === "#home") return;
      applyTab(hashToPortalTab(hash), { scroll });
    };

    syncFromHash(Boolean(window.location.hash) && window.location.hash !== "#home");

    const onHashChange = () => syncFromHash(true);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [applyTab]);

  return (
    <div className="portal-tabs" dir="rtl">
      <div className="portal-tabs__panels" role="tabpanel" aria-label={PORTAL_TABS.find((t) => t.id === activeTab)?.label}>
        {visited.has("systems") ? (
          <div
            id="portal-panel-systems"
            hidden={activeTab !== "systems"}
            className="portal-tabs__panel"
          >
            <PortalSystemsGrid />
          </div>
        ) : null}

        {visited.has("work") ? (
          <div id="portal-panel-work" hidden={activeTab !== "work"} className="portal-tabs__panel">
            <PortalWorkGrid />
          </div>
        ) : null}

        {visited.has("capabilities") ? (
          <div
            id="portal-panel-capabilities"
            hidden={activeTab !== "capabilities"}
            className="portal-tabs__panel"
          >
            <div id="capabilities" className="portal-tabs__anchor">
              <ScrollCapabilitiesSection />
            </div>
          </div>
        ) : null}

        {visited.has("about") ? (
          <div id="portal-panel-about" hidden={activeTab !== "about"} className="portal-tabs__panel">
            <AboutSection />
          </div>
        ) : null}

        {visited.has("branches") ? (
          <div
            id="portal-panel-branches"
            hidden={activeTab !== "branches"}
            className="portal-tabs__panel"
          >
            <BranchesShowcaseSection />
          </div>
        ) : null}

        {visited.has("contact") ? (
          <div
            id="portal-panel-contact"
            hidden={activeTab !== "contact"}
            className="portal-tabs__panel"
          >
            <PortalContact />
          </div>
        ) : null}
      </div>
    </div>
  );
}
