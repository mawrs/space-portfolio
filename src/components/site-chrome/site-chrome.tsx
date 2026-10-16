"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/data/site";
import { setSound, sound, soundIsOn, subscribeSound } from "@/lib/sound";
import styles from "./site-chrome.module.css";

type Panel = "profile" | "newsletter" | null;

type SiteChromeProps = {
  panel: Panel;
  pathname: string;
  onPanel: (panel: Panel) => void;
};

export function SiteChrome({ panel, pathname, onPanel }: SiteChromeProps) {
  const onSheet = pathname.startsWith("/projects");
  const [on, setOn] = useState(true);
  const toggle = (next: Exclude<Panel, null>) => onPanel(panel === next ? null : next);

  useEffect(() => {
    setOn(soundIsOn());
    return subscribeSound(setOn);
  }, []);

  return (
    <header className={`${styles.chrome} ${onSheet ? styles.onSheet : ""}`}>
      <div className={styles.row}>
        <Link href="/" className={styles.label} onPointerEnter={() => sound.hover()}>
          {site.name}
        </Link>
        <button
          type="button"
          className={styles.label}
          aria-expanded={panel === "profile"}
          onPointerEnter={() => sound.hover()}
          onClick={() => {
            sound.ui();
            toggle("profile");
          }}
        >
          {panel === "profile" ? "Close" : "About"}
        </button>
      </div>
      <div className={styles.row}>
        <button
          type="button"
          className={`${styles.label} ${styles.sound}`}
          aria-pressed={on}
          onPointerEnter={() => sound.hover()}
          onClick={() => {
            if (on) {
              sound.ui();
              setSound(false);
            } else {
              setSound(true);
              sound.ui();
            }
          }}
        >
          {on ? "Sound on" : "Sound off"}
        </button>
        <a
          className={styles.label}
          href="/martin-tejeda-resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          onPointerEnter={() => sound.hover()}
          onClick={() => sound.ui()}
        >
          Resume
        </a>
      </div>
    </header>
  );
}
