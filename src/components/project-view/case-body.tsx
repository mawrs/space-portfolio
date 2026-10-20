import { CSSProperties, Fragment, MouseEvent } from "react";
import { CaseBlock } from "@/data/cases";
import { Project } from "@/data/projects";
import { ActionLink } from "@/components/ui/action-link";
import styles from "./project-view.module.css";

function contentGroups(blocks: CaseBlock[]) {
  const groups: { heading: string | null; items: CaseBlock[] }[] = [];

  for (const block of blocks) {
    if (block.type === "h3") {
      groups.push({ heading: block.text, items: [] });
      continue;
    }

    const current = groups.at(-1);
    if (!current) groups.push({ heading: null, items: [block] });
    else current.items.push(block);
  }

  return groups;
}

type CaseBodyProps = {
  project: Project;
  active: string;
  onJump: (event: MouseEvent<HTMLAnchorElement>, id: string) => void;
};

export function CaseBody({ project, active, onJump }: CaseBodyProps) {
  const study = project.study;
  const facts = [
    { label: "Role", values: [study.role] },
    { label: "Timeline", values: [study.timeline] },
    { label: "Team", values: study.team },
    { label: "Skills", values: study.skills },
  ];

  return (
    <div key={project.slug} className={styles.case}>
      <nav className={styles.nav} data-section-nav="" aria-label="Case study sections">
        {study.sections.map((section) => (
          <a
            key={section.id}
            href={`#${project.slug}-${section.id}`}
            aria-current={active === section.id ? "true" : undefined}
            onClick={(event) => onJump(event, section.id)}
          >
            {section.label}
          </a>
        ))}
      </nav>
      <article className={styles.article}>
        <header className={styles.intro}>
          <p className={styles.meta}>{study.meta}</p>
          <h1 id={`project-${project.slug}-title`}>{study.title}</h1>
          {project.liveUrl ? (
            <ActionLink data-gl="pill" href={project.liveUrl} target="_blank" rel="noreferrer">
              Visit
            </ActionLink>
          ) : null}
          <figure className={styles.sizzle}>
            <div
              className={styles.frame}
              data-gl="simple"
              data-id={`${project.slug}-sizzle`}
              data-project={project.slug}
              data-stack-index={0}
              style={{ "--ratio": `${project.width} / ${project.height}` } as CSSProperties}
            >
              {project.video ? (
                <video
                  src={project.video}
                  poster={project.poster}
                  muted
                  loop
                  playsInline
                  autoPlay
                  crossOrigin="anonymous"
                  draggable={false}
                />
              ) : (
                // Sampled by the shared plane. next/image would hide the source element.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={project.poster} alt="" crossOrigin="anonymous" draggable={false} />
              )}
            </div>
          </figure>
        </header>
        {study.sections.map((section) => {
          const blocks = section.blocks.filter(
            (block) => block.type !== "stats" && (section.id !== "overview" || block.type !== "ul"),
          );
          const stats = section.blocks.filter((block) => block.type === "stats");

          const groups = contentGroups(blocks);

          return (
            <section key={section.id} id={`${project.slug}-${section.id}`} className={styles.section} data-section="">
              <h2>{section.label}</h2>
              {groups.map((group, index) => (
                <Fragment key={`${section.id}-${index}`}>
                  {group.heading ? <h3>{group.heading}</h3> : null}
                  {group.items.length > 0 ? (
                    <div className={styles.blocks}>
                      {group.items.map((block, itemIndex) => (
                        <Block key={`${section.id}-${index}-${itemIndex}`} block={block} project={project} />
                      ))}
                    </div>
                  ) : null}
                </Fragment>
              ))}
              {stats.map((block, index) => (
                <Block key={`${section.id}-stats-${index}`} block={block} project={project} />
              ))}
              {section.id === "overview" ? (
                <dl className={styles.facts}>
                  {facts.map((fact) => (
                    <div key={fact.label}>
                      <dt>{fact.label}</dt>
                      {fact.values.map((value) => (
                        <dd key={value}>{value}</dd>
                      ))}
                    </div>
                  ))}
                </dl>
              ) : null}
            </section>
          );
        })}
      </article>
    </div>
  );
}

function Block({ block, project }: { block: CaseBlock; project: Project }) {
  if (block.type === "h3") return <h3>{block.text}</h3>;
  if (block.type === "p") return <p>{block.text}</p>;
  if (block.type === "ul") {
    return (
      <ul>
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }
  if (block.type === "stats") {
    return (
      <div className={styles.stats}>
        {block.items.map((item) => (
          <div key={item.value + item.label}>
            <strong>{item.value}</strong>
            <p>{item.label}</p>
          </div>
        ))}
      </div>
    );
  }
  if (block.type === "link") {
    return (
      <ActionLink href={block.href} target="_blank" rel="noreferrer">
        {block.label}
      </ActionLink>
    );
  }
  const item = project.media[block.index];
  if (!item || item.src === project.video || (!project.video && item.src === project.poster)) return null;
  return (
    <figure className={styles.block}>
      <div
        className={styles.frame}
        data-gl="simple"
        data-id={`${project.slug}-${block.index}`}
        data-project={project.slug}
        data-stack-index={block.index}
        style={{ "--ratio": `${item.width} / ${item.height}` } as CSSProperties}
      >
        {item.video ? (
          <video
            src={item.src}
            poster={item.poster}
            muted
            loop
            playsInline
            autoPlay
            crossOrigin="anonymous"
            draggable={false}
          />
        ) : (
          // Sampled by the shared plane. next/image would hide the source element.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.src} alt="" crossOrigin="anonymous" draggable={false} />
        )}
      </div>
      <figcaption>
        <p>{block.caption ?? item.caption}</p>
      </figcaption>
    </figure>
  );
}
