"use client";

import { usePathname } from "next/navigation";
import { type CSSProperties, type ReactNode, useEffect, useState } from "react";
import { PlaneStage } from "@/components/plane-stage/plane-stage";
import { Portal } from "@/components/portal/portal";
import { SiteChrome } from "@/components/site-chrome/site-chrome";
import styles from "./site-shell.module.css";

type Panel = "profile" | "newsletter" | null;

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [panel, setPanel] = useState<Panel>(null);
  const [booting, setBooting] = useState(true);
  const [loaderExiting, setLoaderExiting] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.panel = panel ?? "";
  }, [panel]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      const timer = window.setTimeout(() => setBooting(false), 200);
      return () => window.clearTimeout(timer);
    }
    const exitTimer = window.setTimeout(() => setLoaderExiting(true), 850);
    const hideTimer = window.setTimeout(() => setBooting(false), 1750);
    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && panel) setPanel(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panel]);

  return (
    <>
      <div className={styles.floor} aria-hidden="true" />
      <PlaneStage />
      {children}
      <SiteChrome panel={panel} pathname={pathname} onPanel={setPanel} />
      {panel ? <Portal kind={panel} onClose={() => setPanel(null)} /> : null}
      {booting ? (
        <div
          className={`${styles.loader} ${loaderExiting ? styles.loaderExiting : ""}`}
          role="status"
          aria-label="Loading Martin Tejeda"
        >
          <div className={styles.loaderScene} aria-hidden="true">
            <div className={styles.orbit}>
              <span className={styles.satellite} />
            </div>
            <div className={styles.hyperspace}>
              {Array.from({ length: 28 }, (_, index) => (
                <span
                  key={index}
                  style={
                    {
                      "--star-angle": `${index * 13 + (index % 3) * 5}deg`,
                      "--star-distance": `${20 + (index % 6) * 6}vmax`,
                      "--star-delay": `${(index % 7) * 22}ms`,
                      "--star-length": 0.7 + (index % 5) * 0.18,
                    } as CSSProperties
                  }
                />
              ))}
            </div>
            <p className={styles.wordmark}>
              <span>Martin</span>
              <span>Tejeda</span>
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
