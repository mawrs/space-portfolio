"use client";

import { useRouter } from "next/navigation";
import { CSSProperties, MouseEvent, useEffect, useRef, useState } from "react";
import { projects } from "@/data/projects";
import { beginFlight, galleryMotion, snapshot } from "@/lib/flight";
import { readRibbon } from "@/lib/ribbon";
import styles from "./gallery.module.css";

export function Gallery() {
  const router = useRouter();
  const ribbonRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; origin: number } | null>(null);
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
    const tick = (now: number) => {
      const step = Math.min(32, now - last);
      last = now;
      const row = readRibbon(mobile);
      if (row && !drag.current) {
        galleryMotion.velocity *= Math.exp(-step / 260);
        const next = galleryMotion.offset + galleryMotion.velocity * step;
        const clamped = Math.min(row.max, Math.max(row.min, next));
        if (clamped !== next) galleryMotion.velocity = 0;
        galleryMotion.offset = clamped;
      }
      if (row) {
        galleryMotion.offset = Math.min(row.max, Math.max(row.min, galleryMotion.offset));
        const translate = row.base + galleryMotion.offset;
        ribbon.style.transform = row.vertical
          ? `translate3d(0px, ${translate}px, 0px)`
          : `translate3d(${translate}px, -50%, 0px)`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [mobile]);

  useEffect(() => {
    const panel = () => document.documentElement.dataset.panel ?? "";
    const down = (event: PointerEvent) => {
      const ribbon = ribbonRef.current;
      if (!ribbon || panel() === "newsletter" || event.button !== 0) return;
      const target = event.target as HTMLElement;
      if (panel() === "profile") {
        if (target.closest("header, [data-portal-control]")) return;
      } else if (!ribbon.contains(target)) return;
      drag.current = { x: event.clientX, y: event.clientY, origin: galleryMotion.offset };
      moved.current = false;
      document.documentElement.classList.add("grabbable");
    };
    const move = (event: PointerEvent) => {
      const current = drag.current;
      if (!current) return;
      const delta = (mobile ? event.clientY - current.y : event.clientX - current.x);
      if (Math.abs(delta) > 10) moved.current = true;
      const previous = galleryMotion.offset;
      galleryMotion.offset = current.origin + delta;
      galleryMotion.velocity = (galleryMotion.offset - previous) / 16;
    };
    const up = () => {
      if (!drag.current) return;
      drag.current = null;
      document.documentElement.classList.remove("grabbable");
    };
    const wheel = (event: WheelEvent) => {
      if (panel() === "newsletter") return;
      event.preventDefault();
      const delta = mobile
        ? event.deltaY
        : Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;
      galleryMotion.offset -= delta;
      galleryMotion.velocity = -delta / 20;
    };
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("wheel", wheel, { passive: false });
    return () => {
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("wheel", wheel);
      document.documentElement.classList.remove("grabbable");
    };
  }, [mobile]);

  const open = (event: MouseEvent<HTMLAnchorElement>, slug: string) => {
    event.preventDefault();
    if (moved.current || document.documentElement.dataset.panel) return;
    const article = event.currentTarget.closest<HTMLElement>("[data-gl='card']");
    if (!article) return;
    beginFlight(slug, article.getBoundingClientRect(), snapshot(article));
    router.push(`/projects/${slug}`, { scroll: false });
  };

  return (
    <main className={styles.gallery}>
      <h1 className={styles.seo}>Featured</h1>
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
            <a href={`/projects/${project.slug}`} onClick={(event) => open(event, project.slug)}>
              {project.video ? (
                <video
                  src={project.video}
                  poster={project.poster}
                  muted
                  loop
                  playsInline
                  autoPlay
                  crossOrigin="anonymous"
                />
              ) : (
                // The plane samples this element; next/image would wrap it.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={project.poster} alt="" crossOrigin="anonymous" draggable={false} />
              )}
              <h2>{project.title}</h2>
              <p className={styles.seo}>{project.summary}</p>
            </a>
          </article>
        ))}
      </div>
    </main>
  );
}
