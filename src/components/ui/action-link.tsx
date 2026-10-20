import { AnchorHTMLAttributes, ReactNode } from "react";
import styles from "./action-link.module.css";

type ActionLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
};

export function ActionLink({ children, className, ...props }: ActionLinkProps) {
  return (
    <a className={[styles.link, className].filter(Boolean).join(" ")} {...props}>
      <span className={styles.mark} aria-hidden="true">
        ↗
      </span>
      <span>{children}</span>
    </a>
  );
}
