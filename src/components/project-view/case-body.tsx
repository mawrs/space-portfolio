import { CSSProperties, Fragment } from "react";
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

export function CaseHero({ project, preview = false }: { project: Project; preview?: boolean }) {
  const study = project.study;

  return (
    <header className={styles.hero}>
      <div className={styles.heroCopy}>
        <p className={styles.meta}>{study.meta}</p>
        <h1 id={preview ? undefined : `project-${project.slug}-title`}>{study.title}</h1>
      </div>
      <figure className={styles.sizzle}>
        {project.poster ? (
          <div
            className={preview ? `${styles.frame} ${styles.previewFrame}` : styles.frame}
            data-gl={preview ? undefined : "simple"}
            data-id={preview ? undefined : `${project.slug}-sizzle`}
            data-project={preview ? undefined : project.slug}
            data-stack-index={preview ? undefined : 0}
            style={{ "--ratio": `${project.width} / ${project.height}` } as CSSProperties}
          >
            {/* Same still as the home thumbnail. The plane samples this element. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={project.poster} alt="" crossOrigin="anonymous" draggable={false} />
          </div>
        ) : (
          <div className={styles.heroPlaceholder} aria-hidden="true" />
        )}
      </figure>
    </header>
  );
}

function visibleMedia(project: Project, blocks: CaseBlock[]) {
  return blocks.filter((block): block is Extract<CaseBlock, { type: "media" }> => {
    if (block.type !== "media") return false;
    const item = project.media[block.index];
    return Boolean(item && item.src !== project.video && (project.video || item.src !== project.poster));
  });
}

export function CaseBody({ project }: { project: Project }) {
  const study = project.study;

  return (
    <div key={project.slug} className={styles.case}>
      <CaseHero project={project} />
      <article className={styles.article}>
        {study.sections.map((section) => {
          const media = visibleMedia(project, section.blocks);
          const pendingMedia = section.blocks.filter(
            (block): block is Extract<CaseBlock, { type: "media" }> => block.type === "media" && !media.includes(block),
          );
          const showOverviewList = project.slug === "true-see" || project.slug === "arcoscan";
          const blocks = section.blocks.filter(
            (block) =>
              block.type !== "stats" &&
              block.type !== "media" &&
              !(section.id === "overview" && block.type === "ul" && !showOverviewList),
          );
          const stats = section.blocks.filter((block) => block.type === "stats");
          const groups = contentGroups(blocks);
          const hasCopy = groups.some((group) => group.items.length > 0);

          return (
            <section key={section.id} id={`${project.slug}-${section.id}`} className={styles.section} data-section="">
              <div className={styles.slideCopy}>
                <h2>{section.label}</h2>
                {hasCopy ? (
                  groups.map((group, index) => (
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
                  ))
                ) : (
                  <div className={styles.blocks} />
                )}
                {stats.map((block, index) => (
                  <Block key={`${section.id}-stats-${index}`} block={block} project={project} />
                ))}
              </div>
              <div className={styles.slideMedia}>
                {media.length > 0 ? (
                  media.map((block) => <Block key={block.index} block={block} project={project} />)
                ) : pendingMedia.length > 0 ? (
                  pendingMedia.map((block) => (
                    <figure key={`${section.id}-${block.index}`} className={styles.block}>
                      <div className={styles.placeholder} aria-hidden="true" />
                      {block.caption ? (
                        <figcaption>
                          <p>{block.caption}</p>
                        </figcaption>
                      ) : null}
                    </figure>
                  ))
                ) : (
                  <div className={styles.placeholder} aria-hidden="true" />
                )}
              </div>
            </section>
          );
        })}
      </article>
    </div>
  );
}

function Block({ block, project }: { block: CaseBlock; project: Project }) {
  if (block.type === "h3") return null;
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
  const caption = block.caption ?? item.caption;
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
      {caption ? (
        <figcaption>
          <p>{caption}</p>
        </figcaption>
      ) : null}
    </figure>
  );
}
