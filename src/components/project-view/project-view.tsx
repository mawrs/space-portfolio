"use client";

import { useRouter } from "next/navigation";
import { MouseEvent as ReactMouseEvent, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Project } from "@/data/projects";
import { flight } from "@/lib/flight";
import { sound } from "@/lib/sound";
import { CaseBody } from "./case-body";
import styles from "./project-view.module.css";

type ProjectViewProps = {
  project: Project;
  previous: Project;
  next: Project;
};

type CaseDragState = {
  startX: number;
  startY: number;
  lastX: number;
  lastAt: number;
  offset: number;
  velocity: number;
  pointerId: number;
  axis: "pending" | "horizontal";
};

let neighborArrival = false;
let arrivalGeneration = 0;

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
  const dragRef = useRef<CaseDragState | null>(null);
  const navigating = useRef(false);
  const arrival = useRef({ slug: "", instant: false });
  const [active, setActive] = useState<string>(project.study.sections[0]?.id ?? "overview");

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
    router.prefetch(`/projects/${previous.slug}`);
    router.prefetch(`/projects/${next.slug}`);
  }, [next.slug, previous.slug, router]);

  useLayoutEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    navigating.current = false;
    delete document.documentElement.dataset.caseHandoff;
    animationRef.current?.cancel();
    sheet.style.opacity = "1";
    sheet.style.transform = "";
    sheet.style.clipPath = "";
    sheet.style.pointerEvents = "";
    document.querySelectorAll<HTMLElement>("[data-neighbor]").forEach((node) => {
      node.getAnimations().forEach((animation) => animation.cancel());
      clearPreviewStyles(node);
    });
    const fromNeighbor =
      arrival.current.instant ||
      neighborArrival ||
      document.documentElement.dataset.caseArrived === "true";
    if (fromNeighbor) {
      const generation = arrivalGeneration;
      arrival.current = { slug: project.slug, instant: true };
      sheet.dataset.arrived = "";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (generation !== arrivalGeneration) return;
          neighborArrival = false;
          delete document.documentElement.dataset.caseArrived;
        });
      });
      return;
    }
    delete sheet.dataset.arrived;
    delete document.documentElement.dataset.caseArrived;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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
    const ids = project.study.sections.map((section) => section.id);
    const sync = () => {
      const range = Math.max(scroller.scrollHeight - scroller.clientHeight, 0);
      const value = range > 0 ? Math.min(1, Math.max(0, scroller.scrollTop / range)) : 1;
      progress.style.setProperty("--project-progress", String(value));
      progress.setAttribute("aria-valuenow", String(Math.round(value * 100)));
      const line = scroller.getBoundingClientRect().top + 96;
      const atEnd = range <= 0 || scroller.scrollTop >= range - 8;
      let current = ids[0] ?? "";
      for (const id of ids) {
        const node = document.getElementById(`${project.slug}-${id}`);
        if (node && node.getBoundingClientRect().top <= line) current = id;
      }
      if (atEnd && ids.length) current = ids[ids.length - 1];
      setActive((previous) => (previous === current ? previous : current));
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
  }, [project.slug, project.study.sections]);

  const jump = useCallback((event: ReactMouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const scroller = scrollRef.current;
    const node = document.getElementById(`${project.slug}-${id}`);
    if (!scroller || !node) return;
    const nav = scroller.querySelector<HTMLElement>("[data-section-nav]");
    const cover = window.matchMedia("(max-width: 649px)").matches ? (nav?.getBoundingClientRect().height ?? 0) : 0;
    const top = node.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - cover - 16;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scroller.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
    setActive(id);
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
    sound.close();
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

  const go = useCallback(
    async (slug: string, direction: PreviewSide) => {
      if (navigating.current) return;
      navigating.current = true;
      sound.open();
      const handoff = () => {
        arrivalGeneration += 1;
        neighborArrival = true;
        document.documentElement.dataset.caseArrived = "true";
        router.push(`/projects/${slug}`, { scroll: false });
      };
      const sheet = sheetRef.current;
      const preview = stageRef.current?.querySelector<HTMLElement>(`[data-neighbor='${direction}']`) ?? null;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!sheet || !preview || reduced) {
        handoff();
        return;
      }

      animationRef.current?.cancel();
      sheet.style.pointerEvents = "none";
      document.documentElement.dataset.caseHandoff = "true";
      preview.getAnimations().forEach((animation) => animation.cancel());
      preview.style.transition = "none";
      preview.style.zIndex = "14";
      const start = preview.getBoundingClientRect();
      const target = previewLayout(direction).center;
      const previewAnimation = preview.animate(
        [
          previewKeyframe(start, readOpacity(preview), readRadius(preview)),
          previewKeyframe(target, 1, target.radius),
        ],
        {
          duration: 780,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          fill: "forwards",
        },
      );
      const sheetTransform = getComputedStyle(sheet).transform;
      const sheetAnimation = sheet.animate(
        [
          { opacity: 1, transform: sheetTransform },
          {
            opacity: 0,
            transform: `translateX(${direction === "next" ? -6 : 6}vw) scale(0.985)`,
          },
        ],
        {
          duration: 780,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          fill: "forwards",
        },
      );
      animationRef.current = sheetAnimation;
      await Promise.allSettled([previewAnimation.finished, sheetAnimation.finished]);
      handoff();
    },
    [router],
  );

  useEffect(() => {
    const stage = stageRef.current;
    const sheet = sheetRef.current;
    if (!stage || !sheet) return;
    const previousPreview = stage.querySelector<HTMLElement>("[data-neighbor='prev']");
    const nextPreview = stage.querySelector<HTMLElement>("[data-neighbor='next']");

    const revealPreview = (offset: number) => {
      const side: PreviewSide = offset < 0 ? "next" : "prev";
      const active = side === "next" ? nextPreview : previousPreview;
      const inactive = side === "next" ? previousPreview : nextPreview;
      if (!active || !offset) return;
      clearPreviewStyles(inactive);
      const { rest, center } = previewLayout(side);
      const distance = Math.max(Math.abs(center.x - rest.x), 1);
      const progress = Math.min(Math.abs(offset) / distance, 1);
      setPreviewRect(active, mixPreviewRect(rest, center, progress), 0.3 + progress * 0.7);
    };

    const resetPreviews = (animate: boolean) => {
      [previousPreview, nextPreview].forEach((node) => {
        if (!node) return;
        node.getAnimations().forEach((animation) => animation.cancel());
        if (!animate || !node.style.width) {
          clearPreviewStyles(node);
          return;
        }
        const side = node.dataset.neighbor as PreviewSide;
        const current = node.getBoundingClientRect();
        const target = previewLayout(side).rest;
        const animation = node.animate(
          [
            previewKeyframe(current, readOpacity(node), readRadius(node)),
            previewKeyframe(target, 0.3, target.radius),
          ],
          {
            duration: 420,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            fill: "forwards",
          },
        );
        animation.onfinish = () => {
          clearPreviewStyles(node);
          animation.cancel();
        };
      });
    };

    const settleSheet = (offset: number) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        sheet.style.transform = "";
        return;
      }
      const animation = sheet.animate(
        [
          { transform: `translateX(${offset}px)` },
          { transform: "translateX(0)" },
        ],
        {
          duration: 420,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        },
      );
      animationRef.current = animation;
      animation.onfinish = () => {
        sheet.style.transform = "";
        animation.cancel();
        if (animationRef.current === animation) animationRef.current = null;
      };
    };

    const stop = (event: PointerEvent | null, navigate: boolean) => {
      const current = dragRef.current;
      if (!current || (event && event.pointerId !== current.pointerId)) return;
      dragRef.current = null;
      stage.removeAttribute("data-dragging");
      if (stage.hasPointerCapture(current.pointerId)) {
        stage.releasePointerCapture(current.pointerId);
      }
      if (current.axis !== "horizontal") {
        resetPreviews(false);
        return;
      }
      const elapsed = event ? event.timeStamp - current.lastAt : 0;
      const velocity = elapsed > 100 ? 0 : current.velocity;
      const projected = current.offset + velocity * 180;
      const threshold = Math.min(sheet.clientWidth * 0.12, 140);
      if (navigate && Math.abs(projected) >= threshold) {
        if (projected < 0) {
          go(next.slug, "next");
        } else {
          go(previous.slug, "prev");
        }
        return;
      }
      resetPreviews(true);
      settleSheet(current.offset);
    };

    const down = (event: PointerEvent) => {
      if (event.button !== 0 || navigating.current || document.documentElement.dataset.panel) return;
      if (dragRef.current) return;
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest("a, button")) return;
      dragRef.current = {
        startX: event.clientX,
        startY: event.clientY,
        lastX: event.clientX,
        lastAt: event.timeStamp,
        offset: 0,
        velocity: 0,
        pointerId: event.pointerId,
        axis: "pending",
      };
    };

    const move = (event: PointerEvent) => {
      const current = dragRef.current;
      if (!current || current.pointerId !== event.pointerId) return;
      if (event.pointerType === "mouse" && (event.buttons & 1) === 0) {
        stop(null, false);
        return;
      }
      const deltaX = event.clientX - current.startX;
      const deltaY = event.clientY - current.startY;
      if (current.axis === "pending") {
        if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) <= 10) return;
        if (Math.abs(deltaX) <= Math.abs(deltaY)) {
          dragRef.current = null;
          return;
        }
        current.axis = "horizontal";
        animationRef.current?.cancel();
        animationRef.current = null;
        sheet.style.opacity = "1";
        sheet.style.clipPath = "";
        stage.dataset.dragging = "";
        stage.setPointerCapture(event.pointerId);
      }
      event.preventDefault();
      const elapsed = Math.max(event.timeStamp - current.lastAt, 1);
      const velocity = (event.clientX - current.lastX) / elapsed;
      current.velocity = current.velocity * 0.65 + velocity * 0.35;
      current.lastX = event.clientX;
      current.lastAt = event.timeStamp;
      const limit = Math.max(sheet.clientWidth * 0.45, 1);
      current.offset = Math.tanh(deltaX / limit) * limit;
      sheet.style.transform = `translate3d(${current.offset}px, 0, 0)`;
      revealPreview(current.offset);
    };

    const up = (event: PointerEvent) => stop(event, true);
    const cancel = () => stop(null, false);
    stage.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", cancel);
    window.addEventListener("blur", cancel);
    return () => {
      stage.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", cancel);
      window.removeEventListener("blur", cancel);
      dragRef.current = null;
      stage.removeAttribute("data-dragging");
      resetPreviews(false);
    };
  }, [go, next.slug, previous.slug, project.slug]);

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
          <CaseBody project={project} active={active} onJump={jump} />
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
        onOpen={() => go(previous.slug, "prev")}
      />
      <Neighbor
        project={next}
        side="next"
        onOpen={() => go(next.slug, "next")}
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
      <aside data-neighbor={side}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={project.poster} alt="" crossOrigin="anonymous" />
      </aside>
    </div>
  );
}

function box(rect: DOMRect) {
  return { x: rect.left, y: rect.top, w: rect.width, h: rect.height };
}

function previewLayout(side: PreviewSide) {
  const rem = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 10;
  const desktop = window.matchMedia("(min-width: 640px)").matches;
  const restWidth = Math.max(window.innerWidth - rem * 20, 1);
  const restHeight = Math.max(window.innerHeight - rem * 20, 1);
  const peek = rem * (desktop ? 2.5 : 1);
  const centerX = rem * (desktop ? 5 : 2);
  const centerY = rem * (desktop ? 2 : 1.5);
  const radius = rem * (desktop ? 2 : 1.5);
  const rest: PreviewRect = {
    x: side === "next" ? window.innerWidth - peek : peek - restWidth,
    y: rem * 10,
    width: restWidth,
    height: restHeight,
    radius,
  };
  const center: PreviewRect = {
    x: centerX,
    y: centerY,
    width: window.innerWidth - centerX * 2,
    height: window.innerHeight - centerY * 2,
    radius,
  };
  return { rest, center };
}

function mixPreviewRect(from: PreviewRect, to: PreviewRect, amount: number): PreviewRect {
  return {
    x: from.x + (to.x - from.x) * amount,
    y: from.y + (to.y - from.y) * amount,
    width: from.width + (to.width - from.width) * amount,
    height: from.height + (to.height - from.height) * amount,
    radius: from.radius + (to.radius - from.radius) * amount,
  };
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
