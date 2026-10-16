"use client";

import { useRouter } from "next/navigation";
import { CSSProperties, useEffect, useRef } from "react";
import { Project } from "@/data/projects";
import { beginFlight, beginReturn, snapshot } from "@/lib/flight";
import styles from "./project-view.module.css";

type ProjectViewProps = {
  project: Project;
  previous: Project;
  next: Project;
};

export function ProjectView({ project, previous, next }: ProjectViewProps) {
  const router = useRouter();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
  }, [project.slug]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (document.documentElement.dataset.panel) return;
      if (event.key === "Escape") {
        event.preventDefault();
        const hero = document.querySelector<HTMLElement>("[data-flight='1']");
        if (hero) beginReturn(project.slug, hero.getBoundingClientRect());
        router.push("/", { scroll: false });
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        const node = document.querySelector<HTMLElement>("[data-neighbor='next']");
        beginFlight(next.slug, node?.getBoundingClientRect() ?? heroRect(), snapshot(node));
        router.push(`/projects/${next.slug}`, { scroll: false });
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        const node = document.querySelector<HTMLElement>("[data-neighbor='prev']");
        beginFlight(previous.slug, node?.getBoundingClientRect() ?? heroRect(), snapshot(node));
        router.push(`/projects/${previous.slug}`, { scroll: false });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next.slug, previous.slug, project.slug, router]);

  const close = () => {
    const hero = document.querySelector<HTMLElement>("[data-flight='1']");
    if (hero) beginReturn(project.slug, hero.getBoundingClientRect());
    router.push("/", { scroll: false });
  };

  const go = (slug: string, selector: string) => {
    const node = document.querySelector<HTMLElement>(selector);
    beginFlight(slug, node?.getBoundingClientRect() ?? heroRect(), snapshot(node));
    router.push(`/projects/${slug}`, { scroll: false });
  };

  return (
    <main className={styles.stage}>
      <article className={styles.sheet}>
        <div className={styles.row}>
          <div className={styles.copy} data-gl="text">
            <h1>{project.title}</h1>
            <p>{project.summary}</p>
            <ul className={styles.tags}>
              {project.year ? <li>{project.year}</li> : null}
              {project.credits.map((credit) => (
                <li key={credit.name}>
                  {credit.url ? (
                    <a href={credit.url} target="_blank" rel="noreferrer">
                      {credit.name}
                    </a>
                  ) : (
                    credit.name
                  )}
                </li>
              ))}
              {project.awards > 0 ? (
                <li className={styles.award} aria-label={`${project.awards} awards`}>
                  {project.awards}
                </li>
              ) : null}
            </ul>
            {project.liveUrl ? (
              <a className={styles.visit} data-gl="pill" href={project.liveUrl} target="_blank" rel="noreferrer">
                <span className={styles.visitMark} aria-hidden="true">
                  ↗
                </span>
                <span>Visit</span>
              </a>
            ) : null}
          </div>
          <div className={styles.media}>
            {project.media.map((item, index) => (
              <figure
                key={item.src}
                className={styles.frame}
                data-gl="simple"
                data-id={`${project.slug}-${index}`}
                data-project={project.slug}
                data-flight={index === 0 ? "1" : undefined}
                style={{ "--ratio": `${item.width} / ${item.height}` } as CSSProperties}
              >
                {item.video ? (
                  <video
                    src={item.src}
                    poster={item.poster}
                    muted
                    loop
                    playsInline
                    autoPlay
                    crossOrigin="anonymous"
                  />
                ) : (
                  // Sampled by the shared plane. next/image would hide the source element.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.src} alt="" crossOrigin="anonymous" />
                )}
              </figure>
            ))}
          </div>
        </div>
        <button ref={closeRef} className={styles.close} type="button" onClick={close} aria-label="Close project">
          <span aria-hidden="true">×</span>
        </button>
      </article>
      <Neighbor project={previous} side="prev" onOpen={() => go(previous.slug, "[data-neighbor='prev']")} />
      <Neighbor project={next} side="next" onOpen={() => go(next.slug, "[data-neighbor='next']")} />
    </main>
  );
}

function Neighbor({
  project,
  side,
  onOpen,
}: {
  project: Project;
  side: "prev" | "next";
  onOpen: () => void;
}) {
  return (
    <div className={side === "prev" ? styles.prev : styles.next}>
      <button type="button" onClick={onOpen} aria-label={`${side === "prev" ? "Previous" : "Next"}: ${project.title}`} />
      <aside data-gl="related" data-id={`related-${project.slug}`} data-neighbor={side}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={project.poster} alt="" crossOrigin="anonymous" />
      </aside>
    </div>
  );
}

function heroRect() {
  return new DOMRect(window.innerWidth * 0.5, window.innerHeight * 0.35, 320, 180);
}
