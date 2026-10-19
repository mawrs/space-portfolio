import { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ProjectView } from "@/components/project-view/project-view";
import { getProject, neighbors, projects } from "@/data/projects";
import { site } from "@/data/site";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: site.name };
  return {
    title: `${project.title} — ${site.name}`,
    description: project.summary,
  };
}

export default function ProjectPage({ params }: Props) {
  return (
    <Suspense fallback={null}>
      <ProjectSheet params={params} />
    </Suspense>
  );
}

async function ProjectSheet({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const { previous, next } = neighbors(slug);
  return <ProjectView project={project} previous={previous} next={next} />;
}
