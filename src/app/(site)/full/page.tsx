import Link from "next/link";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import styles from "./full.module.css";

export const metadata = {
  title: `Full — ${site.name}`,
};

export default function FullPage() {
  return (
    <main className={styles.full}>
      <h1>Full</h1>
      <ul>
        {projects.map((project) => (
          <li key={project.slug}>
            <Link href={`/projects/${project.slug}`}>{project.title}</Link>
            <span>{project.year}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
