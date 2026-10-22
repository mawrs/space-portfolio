"use client";

import { useRouter } from "next/navigation";
import { CSSProperties, MouseEvent, useEffect, useRef, useState } from "react";
import { projects } from "@/data/projects";
import { beginFlight, galleryMotion, snapshot } from "@/lib/flight";
import { sound } from "@/lib/sound";
import { readRibbon } from "@/lib/ribbon";
import styles from "./gallery.module.css";

type DragState = {
  startX: number;
  startY: number;
  last: number;
  delta: number;
  movedAt: number;
  pointerId: number;
  active: boolean;
};

function pushGallery(delta: number, mobile: boolean) {
  galleryMotion.target += delta;
  if (mobile) return;
  const limit = Math.max(window.innerWidth, 1);
  const gap = galleryMotion.target - galleryMotion.offset;
  galleryMotion.target = galleryMotion.offset + Math.tanh(gap / limit) * limit;
}

export function Gallery() {
  const router = useRouter();
  const ribbonRef = useRef<HTMLDivElement>(null);
  const drag = useRef<DragState | null>(null);
  const moved = useRef(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 649px)");
    const sync = () => setMobile(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const ribbon = ribbonRef.current;
    if (!ribbon) return;
    let frame = 0;
    let last = performance.now();
    let previousOffset = galleryMotion.offset;
    const tick = (now: number) => {
      const step = Math.min(32, now - last);
      last = now;
      const row = readRibbon(mobile);
      if (row) {
        const ratio = step / (1000 / 60);
        const release = 1 - Math.pow(0.78, Math.min(ratio, 4));
        const coast = galleryMotion.momentum * release;
        galleryMotion.momentum -= coast;
        if (Math.abs(galleryMotion.momentum) < 0.01) galleryMotion.momentum = 0;
        if (coast) pushGallery(coast, mobile);
        if (row.vertical) {
          const clamped = Math.min(row.max, Math.max(row.min, galleryMotion.target));
          if (clamped !== galleryMotion.target) galleryMotion.momentum = 0;
          galleryMotion.target = clamped;
        }
        const ease = 1 - Math.pow(0.9, Math.min(ratio, 2));
        galleryMotion.offset += (galleryMotion.target - galleryMotion.offset) * ease;
        if (Math.abs(galleryMotion.target - galleryMotion.offset) < 0.01) {
          galleryMotion.offset = galleryMotion.target;
        }
        const cards = [...ribbon.children] as HTMLElement[];
        if (row.vertical) {
          galleryMotion.offset = Math.min(row.max, Math.max(row.min, galleryMotion.offset));
          ribbon.style.transform = `translate3d(0px, ${row.base + galleryMotion.offset}px, 0px)`;
          cards.forEach((card) => {
            card.style.transform = "";
          });
        } else {
          const cycle = Math.max(row.cycle, 1);
          const phase = ((((galleryMotion.offset + cycle / 2) % cycle) + cycle) % cycle) - cycle / 2;
          ribbon.style.transform = `translate3d(${row.base + phase}px, -50%, 0px)`;
          cards.forEach((card, index) => {
            const center = row.base + phase + row.starts[index] + row.extents[index] / 2;
            const turn = Math.round((row.viewport / 2 - center) / cycle);
            card.style.transform = `translate3d(${turn * cycle}px, 0px, 0px)`;
          });
        }
      }
      const observed = mobile ? 0 : (galleryMotion.offset - previousOffset) / Math.max(step, 1);
      const response = Math.abs(observed) > Math.abs(galleryMotion.visualVelocity) ? 38 : 170;
      galleryMotion.visualVelocity +=
        (observed - galleryMotion.visualVelocity) * (1 - Math.exp(-step / response));
      previousOffset = galleryMotion.offset;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      galleryMotion.momentum = 0;
      galleryMotion.visualVelocity = 0;
    };
  }, [mobile]);

  useEffect(() => {
    const panel = () => document.documentElement.dataset.panel ?? "";
    let lastWheelAt = 0;
    let rapidWheelAt = -500;
    const stop = (event: PointerEvent | null, fling: boolean) => {
      const current = drag.current;
      if (!current) return;
      if (
        fling &&
        current.active &&
        current.delta &&
        event &&
        event.timeStamp - current.movedAt < 100
      ) {
        pushGallery(current.delta * 12, mobile);
      }
      drag.current = null;
    };
    const down = (event: PointerEvent) => {
      const ribbon = ribbonRef.current;
      if (!ribbon || panel() === "newsletter" || event.button !== 0) return;
      const target = event.target as HTMLElement;
      if (panel() === "profile") {
        if (target.closest("header, [data-portal-control]")) return;
      } else if (!ribbon.contains(target)) return;
      galleryMotion.momentum = 0;
      const position = mobile ? event.clientY : event.clientX;
      drag.current = {
        startX: event.clientX,
        startY: event.clientY,
        last: position,
        delta: 0,
        movedAt: 0,
        pointerId: event.pointerId,
        active: false,
      };
      moved.current = false;
    };
    const move = (event: PointerEvent) => {
      const current = drag.current;
      if (!current || current.pointerId !== event.pointerId) return;
      if (event.pointerType === "mouse" && (event.buttons & 1) === 0) {
        stop(null, false);
        return;
      }
      const along = Math.abs(
        mobile ? event.clientY - current.startY : event.clientX - current.startX,
      );
      const across = Math.abs(
        mobile ? event.clientX - current.startX : event.clientY - current.startY,
      );
      const position = mobile ? event.clientY : event.clientX;
      if (!current.active) {
        if (along <= 10 || along <= across) return;
        current.active = true;
        current.last = position;
        moved.current = true;
      }
      event.preventDefault();
      current.delta = (position - current.last) * 1.5;
      current.last = position;
      current.movedAt = event.timeStamp;
      if (current.delta) pushGallery(current.delta, mobile);
    };
    const wheel = (event: WheelEvent) => {
      if (panel() === "newsletter") return;
      event.preventDefault();
      const delta = mobile
        ? event.deltaY
        : Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;
      const scale = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
      const normalized = delta * scale;
      const gap = event.timeStamp - lastWheelAt;
      if (gap < 30) rapidWheelAt = event.timeStamp;
      const coarse =
        Math.abs(normalized) >= 40 &&
        gap >= 30 &&
        event.timeStamp - rapidWheelAt >= 500;
      lastWheelAt = event.timeStamp;
      if (coarse) {
        galleryMotion.momentum -= normalized * 2.5;
      } else {
        pushGallery(-normalized * 1.25, mobile);
      }
    };
    const up = (event: PointerEvent) => stop(event, true);
    const cancel = () => stop(null, false);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", cancel);
    window.addEventListener("blur", cancel);
    window.addEventListener("wheel", wheel, { passive: false });
    return () => {
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", cancel);
      window.removeEventListener("blur", cancel);
      window.removeEventListener("wheel", wheel);
      stop(null, false);
    };
  }, [mobile]);

  const open = (event: MouseEvent<HTMLAnchorElement>, slug: string) => {
    event.preventDefault();
    if (moved.current || document.documentElement.dataset.panel) return;
    const article = event.currentTarget.closest<HTMLElement>("[data-gl='card']");
    if (!article) return;
    sound.open();
    beginFlight(slug, article.getBoundingClientRect(), snapshot(article));
    router.push(`/projects/${slug}`, { scroll: false });
  };

  return (
    <main className={styles.gallery}>
      <h1 className="srOnly">Featured</h1>
      <div ref={ribbonRef} className={`${styles.ribbon} ${mobile ? styles.stacked : ""}`} data-ribbon="">
        {projects.map((project) => (
          <article
            key={project.slug}
            className={styles.card}
            data-gl="card"
            data-id={project.slug}
            data-title={project.title}
            data-aspect={project.width / project.height}
            style={{ "--ratio": `${project.width} / ${project.height}` } as CSSProperties}
          >
            <a
              href={`/projects/${project.slug}`}
              draggable={false}
              onDragStart={(event) => event.preventDefault()}
              onPointerEnter={() => sound.focus()}
              onClick={(event) => open(event, project.slug)}
            >
              {/* The plane samples this element; next/image would wrap it. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={project.poster} alt="" crossOrigin="anonymous" draggable={false} />
              <h2>{project.title}</h2>
              <p className="srOnly">{project.summary}</p>
            </a>
          </article>
        ))}
      </div>
    </main>
  );
}
