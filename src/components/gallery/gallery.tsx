"use client";

import { useRouter } from "next/navigation";
import { CSSProperties, MouseEvent, useEffect, useRef, useState } from "react";
import { projects } from "@/data/projects";
import { beginFlight, galleryMotion, snapshot } from "@/lib/flight";
import { sound } from "@/lib/sound";
import { readRibbon } from "@/lib/ribbon";
import styles from "./gallery.module.css";

type Sample = { t: number; p: number };

type DragState = {
  startX: number;
  startY: number;
  last: number;
  movedAt: number;
  pointerId: number;
  active: boolean;
  samples: Sample[];
};

const coastMs = 400;
const wheelNotch = 0.004;

function moveRibbon(delta: number) {
  galleryMotion.offset += delta;
  galleryMotion.target = galleryMotion.offset;
}

function releaseSpeed(samples: Sample[], now: number) {
  const last = samples[samples.length - 1];
  if (!last || now - last.t > 80) return 0;
  let first = last;
  for (let index = samples.length - 1; index >= 0; index -= 1) {
    if (last.t - samples[index].t > 64) break;
    first = samples[index];
  }
  const dt = last.t - first.t;
  const distance = last.p - first.p;
  if (dt < 8 || Math.abs(distance) < 6) return 0;
  return distance / dt;
}

export function Gallery() {
  const router = useRouter();
  const ribbonRef = useRef<HTMLDivElement>(null);
  const drag = useRef<DragState | null>(null);
  const moved = useRef(false);
  const wheelGlide = useRef({ speed: 0, at: 0 });
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
        const dragging = drag.current?.active ?? false;
        const glide = wheelGlide.current;
        if (!dragging && glide.speed && now - glide.at > 48) {
          const speed = glide.speed;
          glide.speed = 0;
          if (Math.abs(speed) >= 0.15) galleryMotion.momentum = speed;
        }
        if (!dragging && galleryMotion.momentum) {
          galleryMotion.offset += galleryMotion.momentum * step;
          galleryMotion.momentum *= Math.exp(-step / coastMs);
          if (Math.abs(galleryMotion.momentum) < 0.02) galleryMotion.momentum = 0;
        }
        if (row.vertical) {
          const clamped = Math.min(row.max, Math.max(row.min, galleryMotion.offset));
          if (clamped !== galleryMotion.offset) galleryMotion.momentum = 0;
          galleryMotion.offset = clamped;
        }
        galleryMotion.target = galleryMotion.offset;
        const cards = [...ribbon.children] as HTMLElement[];
        if (row.vertical) {
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
    const stop = (event: PointerEvent | null, fling: boolean) => {
      const current = drag.current;
      if (!current) return;
      wheelGlide.current.speed = 0;
      if (fling && current.active && event) {
        const speed = releaseSpeed(current.samples, event.timeStamp);
        galleryMotion.momentum = Math.abs(speed) < 0.05 ? 0 : speed;
      } else {
        galleryMotion.momentum = 0;
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
      wheelGlide.current.speed = 0;
      const position = mobile ? event.clientY : event.clientX;
      drag.current = {
        startX: event.clientX,
        startY: event.clientY,
        last: position,
        movedAt: 0,
        pointerId: event.pointerId,
        active: false,
        samples: [],
      };
      moved.current = false;
    };
    const move = (event: PointerEvent) => {
      const current = drag.current;
      if (!current || current.pointerId !== event.pointerId) return;
      if (event.pointerType === "mouse" && (event.buttons & 1) === 0) {
        stop(event, true);
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
        current.movedAt = event.timeStamp;
        current.samples = [{ t: event.timeStamp, p: position }];
        moved.current = true;
        galleryMotion.momentum = 0;
        wheelGlide.current.speed = 0;
        return;
      }
      event.preventDefault();
      current.samples.push({ t: event.timeStamp, p: position });
      const cutoff = event.timeStamp - 80;
      while (current.samples.length > 2 && current.samples[0].t < cutoff) current.samples.shift();
      const delta = position - current.last;
      current.last = position;
      current.movedAt = event.timeStamp;
      if (delta) moveRibbon(delta);
    };
    const wheel = (event: WheelEvent) => {
      if (panel() === "newsletter" || drag.current?.active) return;
      event.preventDefault();
      const delta = mobile
        ? event.deltaY
        : Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;
      const scale = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
      const normalized = delta * scale;
      const gap = lastWheelAt ? event.timeStamp - lastWheelAt : 1000;
      lastWheelAt = event.timeStamp;
      if (Math.abs(normalized) < 40 && gap < 40) {
        moveRibbon(-normalized);
        wheelGlide.current.speed = -normalized / Math.max(gap, 8);
        wheelGlide.current.at = event.timeStamp;
        galleryMotion.momentum = 0;
      } else {
        wheelGlide.current.speed = 0;
        galleryMotion.momentum -= normalized * wheelNotch;
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
