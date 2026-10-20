"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { site } from "@/data/site";
import { motion } from "@/data/tokens";
import { sound } from "@/lib/sound";
import styles from "./portal.module.css";

type PortalProps = {
  kind: "profile" | "newsletter";
  onClose: () => void;
};

export function Portal({ kind, onClose }: PortalProps) {
  const lensRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const node = lensRef.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(
      node,
      { opacity: 0, scale: 0.86 },
      { opacity: 1, scale: 1, duration: motion.portalEnterDuration, ease: motion.portalEnterEase },
    );
  }, [kind]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className={`${styles.portal} ${kind === "profile" ? styles.hole : ""}`} onClick={kind === "profile" ? undefined : onClose}>
      <div
        ref={lensRef}
        className={kind === "profile" ? styles.copyWrap : styles.lens}
        role="dialog"
        aria-label={kind === "profile" ? "Profile" : "Newsletter"}
        onClick={(event) => event.stopPropagation()}
      >
        {kind === "profile" ? null : (
          <>
            <span className={styles.ring} aria-hidden="true" />
            <span className={`${styles.ring} ${styles.inner}`} aria-hidden="true" />
          </>
        )}
        {kind === "profile" ? (
          <div className={styles.copy}>
            <p>{site.profile}</p>
            <ul>
              {site.socials.map((social) => (
                <li key={social.label}>
                  <a
                    data-portal-control=""
                    href={social.href}
                    target={social.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noreferrer"
                    onPointerEnter={() => sound.hover()}
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className={styles.copy}>
            <p>{site.newsletter}</p>
            {submitted ? (
              <p className={styles.awards}>Check your inbox.</p>
            ) : (
              <form className={styles.form} onSubmit={submit}>
                <label className="srOnly" htmlFor="newsletter-email">
                  Email
                </label>
                <input id="newsletter-email" type="email" name="email" placeholder="Email" required />
                <button type="submit">Subscribe</button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
