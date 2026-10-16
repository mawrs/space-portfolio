"use client";

import Link from "next/link";
import { site } from "@/data/site";
import styles from "./site-chrome.module.css";

type Panel = "profile" | "newsletter" | null;

type SiteChromeProps = {
  panel: Panel;
  pathname: string;
  onPanel: (panel: Panel) => void;
};

export function SiteChrome({ panel, pathname, onPanel }: SiteChromeProps) {
  const home = pathname === "/";
  const full = pathname === "/full";
  const onSheet = pathname.startsWith("/projects");
  const toggle = (next: Exclude<Panel, null>) => onPanel(panel === next ? null : next);

  return (
    <header className={`${styles.chrome} ${onSheet ? styles.onSheet : ""}`}>
      <div className={styles.row}>
        <Link href="/" className={styles.label}>
          {site.name}
        </Link>
        <button
          type="button"
          className={styles.label}
          aria-expanded={panel === "profile"}
          onClick={() => toggle("profile")}
        >
          {panel === "profile" ? "Close" : "About"}
        </button>
      </div>
      <div className={styles.row}>
        <nav className={styles.modes} aria-label="Index">
          <Link href="/" aria-current={home ? "page" : undefined} className={home ? styles.label : styles.muted}>
            Featured
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/full" aria-current={full ? "page" : undefined} className={full ? styles.label : styles.muted}>
            Full
          </Link>
        </nav>
        <button
          type="button"
          className={styles.label}
          aria-expanded={panel === "newsletter"}
          onClick={() => toggle("newsletter")}
        >
          {panel === "newsletter" ? "Close" : "Resume"}
        </button>
      </div>
    </header>
  );
}
