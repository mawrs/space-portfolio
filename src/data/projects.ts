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
};

export const projects = featured as Project[];

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
