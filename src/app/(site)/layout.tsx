import { SiteShell } from "@/components/site-shell/site-shell";
import { ReactNode } from "react";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
