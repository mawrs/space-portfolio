import { cases, type CaseStudy } from "./cases";
import featured from "./featured.json";

export type Credit = {
  name: string;
  url: string | null;
};

export type Media = {
  src: string;
  poster: string;
  width: number;
  height: number;
  video: boolean;
  caption: string;
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  year: string;
  awards: number;
  liveUrl: string | null;
  credits: Credit[];
  width: number;
  height: number;
  poster: string;
  video: string;
  media: Media[];
  study: CaseStudy;
};

export const projects = (featured as Omit<Project, "study">[]).map((project) => {
  const study = cases[project.slug];
  if (!study) throw new Error(`Missing case study for ${project.slug}`);
  return { ...project, study };
});

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function neighbors(slug: string) {
  const index = Math.max(
    0,
    projects.findIndex((project) => project.slug === slug),
  );
  const count = projects.length;
  return {
    previous: projects[(index - 1 + count) % count],
    next: projects[(index + 1) % count],
  };
}
