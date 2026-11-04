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
  credits: Credit[];
  width: number;
  height: number;
  poster: string;
  heroBackground?: string;
  heroDevice?: string;
  heroOnLight?: boolean;
  video: string;
  media: Media[];
  study: CaseStudy;
};

const lightHeroBackgrounds = new Set(["true-see", "square"]);

export const projects = (featured as Omit<Project, "study">[]).map((project) => {
  const study = cases[project.slug];
  if (!study) throw new Error(`Missing case study for ${project.slug}`);
  return {
    ...project,
    heroBackground: `/projects/${project.slug}/background.png`,
    heroDevice: `/projects/${project.slug}/hero.png`,
    heroOnLight: lightHeroBackgrounds.has(project.slug),
    study,
  };
});

const aiStudy = cases["artificial-intelligence"];
if (!aiStudy) throw new Error("Missing case study for artificial-intelligence");

export const aiProject: Project = {
  slug: "artificial-intelligence",
  title: "Artificial intelligence",
  summary: "",
  year: "",
  awards: 0,
  credits: [],
  width: 1280,
  height: 720,
  poster: "",
  heroBackground: "/projects/ai/background.png",
  heroDevice: "/projects/ai/hero.png",
  heroOnLight: true,
  video: "",
  media: [
    {
      src: "/projects/ai/ai-1.png",
      poster: "/projects/ai/ai-1.png",
      width: 1568,
      height: 1311,
      video: false,
      caption: "",
    },
    {
      src: "/projects/ai/ai-2.png",
      poster: "/projects/ai/ai-2.png",
      width: 847,
      height: 1012,
      video: false,
      caption: "",
    },
    {
      src: "/projects/ai/ai-2.1.png",
      poster: "/projects/ai/ai-2.1.png",
      width: 1003,
      height: 1012,
      video: false,
      caption: "",
    },
    {
      src: "/projects/ai/ai-3.png",
      poster: "/projects/ai/ai-3.png",
      width: 836,
      height: 884,
      video: false,
      caption: "",
    },
    {
      src: "/projects/ai/ai-3.1.png",
      poster: "/projects/ai/ai-3.1.png",
      width: 827,
      height: 884,
      video: false,
      caption: "",
    },
    {
      src: "/projects/ai/ai-4.png",
      poster: "/projects/ai/ai-4.png",
      width: 593,
      height: 986,
      video: false,
      caption: "",
    },
    {
      src: "/projects/ai/ai-4.1.png",
      poster: "/projects/ai/ai-4.1.png",
      width: 1337,
      height: 1332,
      video: false,
      caption: "",
    },
    {
      src: "/projects/ai/ai-5.png",
      poster: "/projects/ai/ai-5.png",
      width: 755,
      height: 824,
      video: false,
      caption: "",
    },
    {
      src: "/projects/ai/ai-5.1.png",
      poster: "/projects/ai/ai-5.1.png",
      width: 757,
      height: 824,
      video: false,
      caption: "",
    },
  ],
  study: aiStudy,
};

export function getProject(slug: string) {
  if (slug === aiProject.slug) return aiProject;
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
