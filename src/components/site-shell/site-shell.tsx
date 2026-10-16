"use client";

import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { PlaneStage } from "@/components/plane-stage/plane-stage";
import { Portal } from "@/components/portal/portal";
import { SiteChrome } from "@/components/site-chrome/site-chrome";
import { setBed, startSound } from "@/lib/sound";
import styles from "./site-shell.module.css";

type Panel = "profile" | "newsletter" | null;

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [panel, setPanel] = useState<Panel>(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => startSound(), []);

  useEffect(() => {
    document.documentElement.dataset.panel = panel ?? "";
    setBed(panel === "profile");
  }, [panel]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => setBooting(false), reduced ? 200 : 900);
    return () => window.clearTimeout(timer);
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
        <div className={styles.loader} aria-hidden="true">
          <span data-gl="bar" />
          <span data-gl="bar" />
          <span data-gl="bar" />
        </div>
      ) : null}
    </>
  );
}
