"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { Project } from "@/data/projects";
import { site } from "@/data/site";
import { flight } from "@/lib/flight";
import { CaseBody, CaseHero } from "./case-body";
import styles from "./project-view.module.css";

type ProjectViewProps = {
  project: Project;
  previous?: Project;
  next?: Project;
};

let neighborArrival = false;
let arrivalGeneration = 0;
let neighborEntrance: { generation: number; rect: PreviewRect } | null = null;

function handoffCaseMedia() {
  document.documentElement.dataset.caseHandoff = "true";
}

export function clearNeighborArrival() {
  neighborArrival = false;
}

type PreviewSide = "prev" | "next";

type PreviewRect = {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
};

export function ProjectView({ project, previous, next }: ProjectViewProps) {
  const router = useRouter();
  const stageRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLElement>(null);
  const animationRef = useRef<Animation | null>(null);
  const moveRef = useRef<(side: PreviewSide) => void>(() => undefined);
  const navigating = useRef(false);
  const arrival = useRef({ slug: "", instant: false });

  const fromNeighbor =
    neighborArrival ||
    (typeof document !== "undefined" && document.documentElement.dataset.caseArrived === "true");
  if (arrival.current.slug !== project.slug) {
    arrival.current = { slug: project.slug, instant: fromNeighbor };
  } else if (fromNeighbor) {
    arrival.current.instant = true;
  }

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
  }, [project.slug]);

  useEffect(() => {
    router.prefetch("/");
    if (previous) router.prefetch(`/projects/${previous.slug}`);
    if (next) router.prefetch(`/projects/${next.slug}`);
  }, [next, previous, router]);

  useLayoutEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    navigating.current = false;
    const fromNeighbor =
      arrival.current.instant ||
      neighborArrival ||
      document.documentElement.dataset.caseArrived === "true";
    if (!fromNeighbor) {
      delete document.documentElement.dataset.caseHandoff;
    }
    animationRef.current?.cancel();
    sheet.style.opacity = "1";
    sheet.style.transform = "";
    sheet.style.clipPath = "";
    sheet.style.pointerEvents = "";
    document.querySelectorAll<HTMLElement>("[data-neighbor]").forEach((node) => {
      node.getAnimations().forEach((animation) => animation.cancel());
      clearPreviewStyles(node);
    });
    if (fromNeighbor) {
      const generation = arrivalGeneration;
      const entrance = neighborEntrance?.generation === generation ? neighborEntrance.rect : null;
      arrival.current = { slug: project.slug, instant: true };
      sheet.dataset.arrived = "";
      handoffCaseMedia();
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (generation !== arrivalGeneration) return;
          neighborArrival = false;
          delete document.documentElement.dataset.caseArrived;
        });
      });
      if (entrance && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const to = sheet.getBoundingClientRect();
        const scaleX = to.width > 0 ? entrance.width / to.width : 1;
        const scaleY = to.height > 0 ? entrance.height / to.height : 1;
        sheet.style.transformOrigin = "top left";
        const animation = sheet.animate(
          [
            {
              transformOrigin: "top left",
              transform: `translate(${entrance.x - to.x}px, ${entrance.y - to.y}px) scale(${scaleX}, ${scaleY})`,
            },
            { transformOrigin: "top left", transform: "translate(0px, 0px) scale(1, 1)" },
          ],
          {
            duration: 780,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            fill: "both",
          },
        );
        animationRef.current = animation;
        animation.onfinish = () => {
          if (neighborEntrance?.generation === generation) neighborEntrance = null;
          sheet.style.transformOrigin = "";
          sheet.style.transform = "";
          animation.cancel();
          if (animationRef.current === animation) animationRef.current = null;
        };
        return () => {
          if (animationRef.current === animation) animation.cancel();
        };
      }
      return;
    }
    neighborEntrance = null;
    delete sheet.dataset.arrived;
    delete document.documentElement.dataset.caseArrived;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      handoffCaseMedia();
      return;
    }

    const sheetRect = sheet.getBoundingClientRect();
    const keyframes: Keyframe[] =
      flight.mode === "open" && flight.from
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
      duration: 900,
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      fill: "both",
    });
    animationRef.current = animation;
    animation.onfinish = () => {
      sheet.style.opacity = "1";
      sheet.style.transform = "";
      sheet.style.clipPath = "";
      handoffCaseMedia();
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
      const section = scroller.querySelector<HTMLElement>("[data-section]");
      const start = section
        ? section.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop
        : scroller.scrollHeight;
      const range = Math.max(scroller.scrollHeight - scroller.clientHeight - start, 0);
      const traveled = Math.max(0, scroller.scrollTop - start);
      const value = range > 0 ? Math.min(1, traveled / range) : traveled > 0 ? 1 : 0;
      const visible = scroller.scrollTop >= start - 1;
      progress.style.setProperty("--project-progress", String(value));
      progress.setAttribute("aria-valuenow", String(Math.round(value * 100)));
      progress.toggleAttribute("data-visible", visible);
      progress.setAttribute("aria-hidden", visible ? "false" : "true");
    };
    const observer = new ResizeObserver(sync);
    const handoff = () => handoffCaseMedia();
    observer.observe(scroller);
    if (scroller.firstElementChild) observer.observe(scroller.firstElementChild);
    scroller.addEventListener("wheel", handoff, { passive: true });
    scroller.addEventListener("scroll", sync, { passive: true });
    sync();
    return () => {
      observer.disconnect();
      scroller.removeEventListener("wheel", handoff);
      scroller.removeEventListener("scroll", sync);
    };
  }, [project.slug]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (document.documentElement.dataset.panel) return;
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) {
        handoffCaseMedia();
      }
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
    if (sheet && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sheet.style.pointerEvents = "none";
      animationRef.current?.cancel();
      const animation = sheet.animate(
        [
          {
            opacity: 1,
            clipPath: `inset(0px 0px 0px 0px round ${readRadius(sheet)}px)`,
            transform: "scale(1)",
          },
          {
            opacity: 0,
            transform: "translateY(0.75rem) scale(0.99)",
          },
        ],
        {
          duration: 280,
          easing: "cubic-bezier(0.4, 0, 1, 1)",
          fill: "forwards",
        },
      );
      animationRef.current = animation;
      await animation.finished.catch(() => undefined);
    }
    router.push("/", { scroll: false });
  };

  const go = useCallback(
    (slug: string, direction: PreviewSide) => {
      if (navigating.current) return;
      navigating.current = true;
      arrivalGeneration += 1;
      neighborArrival = true;
      document.documentElement.dataset.caseArrived = "true";
      handoffCaseMedia();
      const preview = stageRef.current?.querySelector<HTMLElement>(`[data-neighbor='${direction}']`);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (preview && !reduced) {
        const rect = preview.getBoundingClientRect();
        neighborEntrance = {
          generation: arrivalGeneration,
          rect: {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            radius: readRadius(preview),
          },
        };
      } else {
        neighborEntrance = null;
      }
      router.replace(`/projects/${slug}`, { scroll: false });
    },
    [router],
  );

  useEffect(() => {
    const stage = stageRef.current;
    const sheet = sheetRef.current;
    if (!stage || !sheet || !previous || !next) return;
    const previousPreview = stage.querySelector<HTMLElement>("[data-neighbor='prev']");
    const nextPreview = stage.querySelector<HTMLElement>("[data-neighbor='next']");
    let settling = false;

    const baseRect = (offset: number): PreviewRect => {
      const rect = sheet.getBoundingClientRect();
      return {
        x: rect.x - offset,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        radius: readRadius(sheet),
      };
    };

    const layoutFor = (side: PreviewSide, offset: number) =>
      previewLayout(side, baseRect(offset));

    const navigate = (offset: number, side: PreviewSide) => {
      const active = side === "next" ? nextPreview : previousPreview;
      const targetProject = side === "next" ? next : previous;
      if (!active || settling || navigating.current) return;
      settling = true;
      History.prototype.pushState.call(
        window.history,
        window.history.state,
        "",
        `/projects/${targetProject.slug}`,
      );
      document.title = `${targetProject.study.headline} — ${site.name}`;
      stage.dataset.settling = "";
      const { rest, center } = layoutFor(side, offset);
      if (!active.style.width) setPreviewRect(active, rest, 0);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setPreviewRect(active, center, 1);
        go(targetProject.slug, side);
        return;
      }

      const current = active.getBoundingClientRect();
      const currentOpacity = readOpacity(active);
      const destinationOffset =
        side === "next"
          ? -(center.x + center.width + 1)
          : window.innerWidth - center.x + 1;
      const travel = Math.max(Math.abs(destinationOffset), 1);
      const duration = Math.max(
        180,
        Math.min(420, (Math.abs(destinationOffset - offset) / travel) * 420),
      );
      animationRef.current?.cancel();
      const sheetAnimation = sheet.animate(
        [
          { transform: `translate3d(${offset}px, 0, 0)` },
          { transform: `translate3d(${destinationOffset}px, 0, 0)` },
        ],
        {
          duration,
          easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
          fill: "forwards",
        },
      );
      const previewAnimation = active.animate(
        [
          previewKeyframe(current, currentOpacity, readRadius(active)),
          previewKeyframe(center, 1, center.radius),
        ],
        {
          duration,
          easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
          fill: "forwards",
        },
      );
      animationRef.current = sheetAnimation;
      Promise.all([
        sheetAnimation.finished.catch(() => undefined),
        previewAnimation.finished.catch(() => undefined),
      ]).then(() => {
        if (!settling) return;
        setPreviewRect(active, center, 1);
        go(targetProject.slug, side);
      });
    };

    const moveFromControl = (side: PreviewSide) => {
      if (navigating.current || settling) return;
      handoffCaseMedia();
      animationRef.current?.cancel();
      animationRef.current = null;
      sheet.style.opacity = "1";
      sheet.style.clipPath = "";
      navigate(0, side);
    };
    moveRef.current = moveFromControl;

    return () => {
      settling = false;
      moveRef.current = () => undefined;
      stage.removeAttribute("data-settling");
      [previousPreview, nextPreview].forEach((node) => clearPreviewStyles(node));
    };
  }, [go, next, previous, project.slug]);

  return (
    <main ref={stageRef} className={styles.stage}>
      <article
        ref={sheetRef}
        className={styles.sheet}
        data-project-sheet=""
        data-arrived={arrival.current.instant ? "" : undefined}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`project-${project.slug}-title`}
      >
        <div ref={scrollRef} className={styles.scroller} data-project-scroll="">
          <CaseBody project={project} />
        </div>
        <button ref={closeRef} className={styles.close} type="button" onClick={close} aria-label="Close project">
          <span aria-hidden="true">×</span>
        </button>
        <div
          ref={progressRef}
          className={styles.readingBar}
          role="progressbar"
          aria-label="Case study progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={0}
          aria-hidden="true"
        >
          <p>
            {project.title}: {project.study.title}
          </p>
          <div className={styles.progress} />
        </div>
      </article>
      {previous ? (
        <Neighbor project={previous} side="prev" onOpen={() => moveRef.current("prev")} />
      ) : null}
      {next ? <Neighbor project={next} side="next" onOpen={() => moveRef.current("next")} /> : null}
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
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={side === "prev" ? "/left-key.png" : "/right-key.png"}
          alt=""
          aria-hidden="true"
          draggable={false}
        />
      </button>
      <aside data-neighbor={side} aria-hidden="true">
        <CasePreview project={project} />
        <div className={styles.close}>
          <span>×</span>
        </div>
      </aside>
    </div>
  );
}

function CasePreview({ project }: { project: Project }) {
  const overview = project.study.sections[0];

  return (
    <div className={`${styles.case} ${styles.previewCase}`}>
      <CaseHero project={project} preview />
      <article className={styles.article}>
        {overview ? (
          <section className={styles.section}>
            <div className={styles.slideCopy}>
              <h2>{overview.label}</h2>
              <div className={styles.blocks}>
                {overview.blocks.map((block, index) =>
                  block.type === "p" ? <p key={index}>{block.text}</p> : null,
                )}
              </div>
            </div>
            <div className={styles.placeholder} />
          </section>
        ) : null}
      </article>
    </div>
  );
}

function previewLayout(side: PreviewSide, sheet: PreviewRect) {
  const rem = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 10;
  const gap = rem * 1.5;
  const rest: PreviewRect = {
    ...sheet,
    x: side === "next" ? sheet.x + sheet.width + gap : sheet.x - sheet.width - gap,
  };
  return { rest, center: sheet };
}

function setPreviewRect(node: HTMLElement, rect: PreviewRect, opacity: number) {
  node.style.transition = "none";
  node.style.transform = "none";
  node.style.top = `${rect.y}px`;
  node.style.left = `${rect.x}px`;
  node.style.right = "auto";
  node.style.bottom = "auto";
  node.style.width = `${rect.width}px`;
  node.style.height = `${rect.height}px`;
  node.style.borderRadius = `${rect.radius}px`;
  node.style.opacity = String(opacity);
  node.style.zIndex = "14";
}

function clearPreviewStyles(node: HTMLElement | null) {
  if (!node) return;
  [
    "transition",
    "transform",
    "top",
    "left",
    "right",
    "bottom",
    "width",
    "height",
    "border-radius",
    "opacity",
    "z-index",
  ].forEach((property) => node.style.removeProperty(property));
}

function previewKeyframe(
  rect: Pick<DOMRect, "x" | "y" | "width" | "height"> | PreviewRect,
  opacity: number,
  radius: number,
): Keyframe {
  return {
    top: `${rect.y}px`,
    left: `${rect.x}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    borderRadius: `${radius}px`,
    opacity,
    transform: "none",
  };
}

function readOpacity(element: HTMLElement) {
  return Number.parseFloat(getComputedStyle(element).opacity) || 0;
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
