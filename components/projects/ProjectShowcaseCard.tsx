"use client";

import Image from "next/image";
import type { ProjectItem } from "@/lib/projects/ProjectItem";

type ProjectShowcaseCardProps = {
  project: ProjectItem;
  index: number;
};

export function ProjectShowcaseCard({ project, index }: ProjectShowcaseCardProps) {
  const isRemoteImage = project.image.startsWith("http");
  const isLarge = project.tileSize === "xl";

  return (
    <article
      className={`project-card project-card--${project.tileSize}`}
      data-project-index={index}
      data-project-id={project.id}
      data-project-size={project.tileSize}
    >
      <div className="project-card__media">
        {isRemoteImage ? (
          <img src={project.image} alt="" className="project-card__image" loading="lazy" />
        ) : (
          <Image
            src={project.image}
            alt=""
            fill
            sizes={isLarge ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
            className="project-card__image"
            loading={index < 4 ? "eager" : "lazy"}
            priority={index < 2}
          />
        )}
        <div className="project-card__scrim" aria-hidden="true" />

        {project.logo ? (
          <div className="project-card__logo">
            <Image src={project.logo} alt="" width={56} height={56} unoptimized />
          </div>
        ) : null}

        <div className="project-card__overlay">
          <div className="project-card__meta">
            <span className="project-card__category">{project.categoryLabel}</span>
            <span className="project-card__year">{project.year}</span>
          </div>
          <h3 className="project-card__title">{project.name}</h3>
          <p className="project-card__tagline">{project.tagline}</p>
          <div className="project-card__tags" aria-label="תגיות פרויקט">
            {project.tags.map((tag) => (
              <span key={`${project.id}-${tag}`} className="project-card__tag">
                {tag}
              </span>
            ))}
          </div>
          {project.url ? (
            <a className="project-card__cta" href={project.url} target="_blank" rel="noopener noreferrer">
              <span>למערכת החיה</span>
              <span className="project-card__arrow" aria-hidden="true">
                ←
              </span>
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
