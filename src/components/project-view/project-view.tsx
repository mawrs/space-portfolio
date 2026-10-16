"use client";

import { useRouter } from "next/navigation";
import { CSSProperties, useEffect, useLayoutEffect, useRef } from "react";
import { Project } from "@/data/projects";
import { beginFlight, flight, snapshot } from "@/lib/flight";
import styles from "./project-view.module.css";

type ProjectViewProps = {
  project: Project;
  previous: Project;
  next: Project;
};

export function ProjectView({ project, previous, next }: ProjectViewProps) {
  const router = useRouter();
  const closeRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLElement>(null);
  const animationRef = useRef<Animation | null>(null);
  const navigating = useRef(false);

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
  }, [project.slug]);

  useLayoutEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    navigating.current = false;
    animationRef.current?.cancel();
    sheet.style.opacity = "1";
    sheet.style.transform = "";
    sheet.style.clipPath = "";
    const direction = document.documentElement.dataset.caseDirection as "prev" | "next" | undefined;
    delete document.documentElement.dataset.caseDirection;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const sheetRect = sheet.getBoundingClientRect();
    const keyframes: Keyframe[] = direction
      ? [
          {
            opacity: 0,
            transform: `translateX(${direction === "next" ? 10 : -10}vw) scale(0.985)`,
          },
          { opacity: 1, transform: "translateX(0) scale(1)" },
        ]
      : flight.mode === "open" && flight.from
        ? [
            {
              opacity: 0.55,
              clipPath: clipFor(sheetRect, flight.from),
              transform: "scale(0.985)",
            },
            {
              opacity: 1,
              clipPath: `inset(0px 0px 0px 0px round ${readRadius(sheet)}px)`,
              transform: "scale(1)",
            },
          ]
        : [
            { opacity: 0, transform: "translateY(1.5rem) scale(0.985)" },
            { opacity: 1, transform: "translateY(0) scale(1)" },
          ];
    const animation = sheet.animate(keyframes, {
      duration: direction ? 650 : 900,
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      fill: "both",
    });
    animationRef.current = animation;
    animation.onfinish = () => {
      sheet.style.opacity = "1";
      sheet.style.transform = "";
      sheet.style.clipPath = "";
      animation.cancel();
      if (animationRef.current === animation) animationRef.current = null;
    };
    return () => {
      if (animationRef.current === animation) animation.cancel();
    };
  }, [project.slug]);

  useEffect(() => {
    const scroller = scrollRef.current;
    const progress = progressRef.current;
    if (!scroller || !progress) return;
    scroller.scrollTop = 0;
    const sync = () => {
      const range = Math.max(scroller.scrollHeight - scroller.clientHeight, 0);
      const value = range > 0 ? Math.min(1, Math.max(0, scroller.scrollTop / range)) : 1;
      progress.style.setProperty("--project-progress", `${value * 360}deg`);
      progress.setAttribute("aria-valuenow", String(Math.round(value * 100)));
    };
    const observer = new ResizeObserver(sync);
    observer.observe(scroller);
    if (scroller.firstElementChild) observer.observe(scroller.firstElementChild);
    scroller.addEventListener("scroll", sync, { passive: true });
    sync();
    return () => {
      observer.disconnect();
      scroller.removeEventListener("scroll", sync);
    };
  }, [project.slug]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (document.documentElement.dataset.panel) return;
      if (event.key === "Escape") {
        event.preventDefault();
        closeRef.current?.click();
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        document.querySelector<HTMLButtonElement>("[data-neighbor-control='next']")?.click();
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        document.querySelector<HTMLButtonElement>("[data-neighbor-control='prev']")?.click();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const close = async () => {
    if (navigating.current) return;
    navigating.current = true;
    const sheet = sheetRef.current;
    const target = document.querySelector<HTMLElement>(
      `[data-gl="card"][data-id="${project.slug}"]`,
    );
    if (sheet && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sheet.style.pointerEvents = "none";
      animationRef.current?.cancel();
      const end: Keyframe = target
        ? {
            opacity: 0.25,
            clipPath: clipFor(sheet.getBoundingClientRect(), box(target.getBoundingClientRect())),
            transform: "scale(0.985)",
          }
        : {
            opacity: 0,
            transform: "translateY(1.5rem) scale(0.985)",
          };
      const animation = sheet.animate(
        [
          {
            opacity: 1,
            clipPath: `inset(0px 0px 0px 0px round ${readRadius(sheet)}px)`,
            transform: "scale(1)",
          },
          end,
        ],
        {
          duration: 620,
          easing: "cubic-bezier(0.7, 0, 0.2, 1)",
          fill: "forwards",
        },
      );
      animationRef.current = animation;
      await animation.finished.catch(() => undefined);
    }
    router.push("/", { scroll: false });
  };

  const go = async (
    slug: string,
    selector: string,
    direction: "prev" | "next",
  ) => {
    if (navigating.current) return;
    navigating.current = true;
    const node = document.querySelector<HTMLElement>(selector);
    const from = node?.getBoundingClientRect() ?? heroRect();
    const frame = snapshot(node);
    const sheet = sheetRef.current;
    if (sheet && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sheet.style.pointerEvents = "none";
      animationRef.current?.cancel();
      const animation = sheet.animate(
        [
          { opacity: 1, transform: "translateX(0) scale(1)" },
          {
            opacity: 0.15,
            transform: `translateX(${direction === "next" ? -10 : 10}vw) scale(0.985)`,
          },
        ],
        {
          duration: 360,
          easing: "cubic-bezier(0.7, 0, 0.2, 1)",
          fill: "forwards",
        },
      );
      animationRef.current = animation;
      await animation.finished.catch(() => undefined);
    }
    document.documentElement.dataset.caseDirection = direction;
    beginFlight(slug, from, frame);
    router.push(`/projects/${slug}`, { scroll: false });
  };

  return (
    <main className={styles.stage}>
      <article
        ref={sheetRef}
        className={styles.sheet}
        data-project-sheet=""
        role="dialog"
        aria-modal="true"
        aria-labelledby={`project-${project.slug}-title`}
      >
        <div ref={scrollRef} className={styles.scroller} data-project-scroll="">
          <div key={project.slug} className={styles.row}>
            <div className={styles.copy} data-gl="text">
              <h1 id={`project-${project.slug}-title`}>{project.title}</h1>
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
                  data-stack-index={index}
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
        </div>
        <button ref={closeRef} className={styles.close} type="button" onClick={close} aria-label="Close project">
          <span aria-hidden="true">×</span>
        </button>
        <div
          ref={progressRef}
          className={styles.progress}
          role="progressbar"
          aria-label="Case study progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={0}
        />
      </article>
      <Neighbor
        project={previous}
        side="prev"
        onOpen={() => void go(previous.slug, "[data-neighbor='prev']", "prev")}
      />
      <Neighbor
        project={next}
        side="next"
        onOpen={() => void go(next.slug, "[data-neighbor='next']", "next")}
      />
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
      <button
        type="button"
        data-neighbor-control={side}
        onClick={onOpen}
        aria-label={`${side === "prev" ? "Previous" : "Next"}: ${project.title}`}
      />
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

function box(rect: DOMRect) {
  return { x: rect.left, y: rect.top, w: rect.width, h: rect.height };
}

function readRadius(element: HTMLElement) {
  return Number.parseFloat(getComputedStyle(element).borderTopLeftRadius) || 0;
}

function clipFor(
  sheet: DOMRect,
  target: { x: number; y: number; w: number; h: number },
) {
  const left = Math.min(sheet.width, Math.max(0, target.x - sheet.left));
  const top = Math.min(sheet.height, Math.max(0, target.y - sheet.top));
  const right = Math.min(
    sheet.width,
    Math.max(0, sheet.right - target.x - target.w),
  );
  const bottom = Math.min(
    sheet.height,
    Math.max(0, sheet.bottom - target.y - target.h),
  );
  const radius = Math.min(24, target.w * 0.04, target.h * 0.04);
  return `inset(${top}px ${right}px ${bottom}px ${left}px round ${radius}px)`;
}
