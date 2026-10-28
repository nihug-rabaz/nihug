"use client";

import { useMemo, useState } from "react";
import { ProjectShowcaseCard } from "@/components/projects/ProjectShowcaseCard";
import type { ProjectCategory } from "@/lib/projects/ProjectItem";
import { projectsCatalog } from "@/lib/projects/ProjectsCatalog";

type FilterCategory = "all" | ProjectCategory;

const FILTERS: { id: FilterCategory; label: string }[] = [
  { id: "all", label: "הכל" },
  { id: "ai", label: "בינה מלאכותית" },
  { id: "web", label: "אתר ומערכת" },
  { id: "mobile", label: "אפליקציה" },
  { id: "platform", label: "פלטפורמה" }
];

function matchesSearch(project: { name: string; tagline: string; description: string; tags: readonly string[] }, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  const haystack = [project.name, project.tagline, project.description, ...project.tags].join(" ").toLowerCase();
  return haystack.includes(normalized);
}

export default function PortalSystemsGrid() {
  const liveProjects = useMemo(
    () => projectsCatalog.getAll().filter((project) => Boolean(project.url)),
    []
  );
  const [category, setCategory] = useState<FilterCategory>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return liveProjects.filter((project) => {
      if (category !== "all" && project.category !== category) return false;
      return matchesSearch(project, search);
    });
  }, [liveProjects, category, search]);

  return (
    <section id="systems" className="portal-systems" aria-labelledby="portal-systems-title">
      <div className="portal-systems__inner">
        <header className="portal-systems__header">
          <h2 id="portal-systems-title" className="knowledge-title portal-systems__title">
            <span>מערכות</span>
            <span>פעילות</span>
          </h2>
          <p className="portal-systems__lead">סננו לפי תחום או חפשו לפי שם — רק מערכות עם קישור חי.</p>
        </header>

        <div className="portal-systems__toolbar">
          <div className="portal-systems__filters" role="tablist" aria-label="סינון לפי תחום">
            {FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                role="tab"
                aria-selected={category === filter.id}
                className={`portal-systems__filter${category === filter.id ? " is-active" : ""}`}
                onClick={() => setCategory(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <label className="portal-systems__search">
            <span className="sr-only">חיפוש מערכות</span>
            <input
              type="search"
              placeholder="חיפוש מערכת..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              autoComplete="off"
            />
          </label>
        </div>

        {filtered.length === 0 ? (
          <p className="portal-systems__empty">לא נמצאו מערכות התואמות את החיפוש.</p>
        ) : (
          <div className="portal-systems-grid">
            {filtered.map((project, index) => (
              <ProjectShowcaseCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
