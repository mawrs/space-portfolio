"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearNeighborArrival } from "@/components/project-view/project-view";
import { aiProject } from "@/data/projects";
import { site } from "@/data/site";
import styles from "./site-chrome.module.css";

type Panel = "profile" | "newsletter" | null;

type SiteChromeProps = {
  panel: Panel;
  pathname: string;
  onPanel: (panel: Panel) => void;
};

export function SiteChrome({ panel, pathname, onPanel }: SiteChromeProps) {
  const router = useRouter();
  const onSheet = pathname.startsWith("/projects");
  const toggle = (next: Exclude<Panel, null>) => onPanel(panel === next ? null : next);
  const openAi = () => {
    if (panel) onPanel(null);
    delete document.documentElement.dataset.caseArrived;
    clearNeighborArrival();
    router.push(`/projects/${aiProject.slug}`, { scroll: false });
  };

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
        <button type="button" className={styles.label} onClick={openAi}>
          Artificial intelligence
        </button>
        <a
          className={styles.label}
          href="/martin-tejeda-resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          Resume
        </a>
      </div>
    </header>
  );
}
