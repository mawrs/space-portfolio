"use client";

import { CSSProperties, Fragment, useEffect, useState } from "react";
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
  const layered = Boolean(project.heroBackground && project.heroDevice);
  const facts = [
    { label: "Role", value: study.role },
    { label: "Teams", value: study.team.join(", ") },
    { label: "Timeline", value: study.timeline },
    { label: "Skills", value: study.skills.join(", ") },
  ];

  return (
    <header
      className={[styles.hero, layered ? styles.heroLayered : "", project.heroOnLight ? styles.heroOnLight : ""]
        .filter(Boolean)
        .join(" ")}
      style={
        layered
          ? ({ "--hero-background": `url("${project.heroBackground}")` } as CSSProperties)
          : undefined
      }
    >
      <div className={styles.heroCopy}>
        <p className={styles.meta}>{study.meta}</p>
        <h1 id={preview ? undefined : `project-${project.slug}-title`}>{study.title}</h1>
        <ul className={styles.heroFacts}>
          {facts.map((item) => (
            <li key={item.label}>
              <span className={styles.factLabel}>{item.label}:</span> {item.value}
            </li>
          ))}
        </ul>
      </div>
      <figure className={styles.sizzle}>
        {layered ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className={styles.heroDevice} src={project.heroDevice} alt="" draggable={false} />
        ) : project.poster ? (
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

export function CaseBody({ project, preview = false }: { project: Project; preview?: boolean }) {
  const study = project.study;

  return (
    <div key={project.slug} className={styles.case}>
      <CaseHero project={project} preview={preview} />
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
          const gallery = media.length > 1;

          const copy = (
            <div className={styles.slideCopy}>
              <h2>{section.label}</h2>
              {hasCopy ? (
                groups.map((group, index) => (
                  <Fragment key={`${section.id}-${index}`}>
                    {group.heading ? <h3>{group.heading}</h3> : null}
                    {group.items.length > 0 ? (
                      <div className={styles.blocks}>
                        {group.items.map((block, itemIndex) => (
                          <Block
                            key={`${section.id}-${index}-${itemIndex}`}
                            block={block}
                            project={project}
                            preview={preview}
                          />
                        ))}
                      </div>
                    ) : null}
                  </Fragment>
                ))
              ) : (
                <div className={styles.blocks} />
              )}
              {stats.map((block, index) => (
                <Block key={`${section.id}-stats-${index}`} block={block} project={project} preview={preview} />
              ))}
            </div>
          );
          const visuals = gallery ? (
            <MediaGallery media={media} project={project} preview={preview} />
          ) : (
            <div className={styles.slideMedia}>
              {media.length > 0 ? (
                media.map((block) => (
                  <Block key={block.index} block={block} project={project} preview={preview} />
                ))
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
          );

          const content = (
            <section
              id={`${project.slug}-${section.id}`}
              className={styles.section}
              data-section=""
            >
              {copy}
              {visuals}
            </section>
          );

          return <Fragment key={section.id}>{content}</Fragment>;
        })}
      </article>
    </div>
  );
}

function MediaGallery({
  media,
  project,
  preview,
}: {
  media: Array<Extract<CaseBlock, { type: "media" }>>;
  project: Project;
  preview: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = media[activeIndex] ?? media[0];
  const frameId = `${project.slug}-gallery-${media.map((block) => block.index).join("-")}`;

  useEffect(() => {
    for (const block of media) {
      const item = project.media[block.index];
      if (!item || item.video) continue;
      const image = new Image();
      image.decoding = "async";
      image.src = item.src;
    }
  }, [media, project]);

  return (
    <div className={`${styles.slideMedia} ${styles.mediaGallery}`}>
      <Block block={active} project={project} preview={preview} frameId={frameId} />
      <div className={styles.mediaThumbnails} role="group" aria-label="Choose an image">
        {media.map((block, index) => {
          const item = project.media[block.index];
          if (!item) return null;
          const label = block.caption ?? item.caption ?? `Image ${index + 1}`;
          return (
            <button
              key={block.index}
              type="button"
              className={`${styles.mediaThumbnail} ${index === activeIndex ? styles.mediaThumbnailActive : ""}`}
              aria-label={`Show ${label}`}
              aria-pressed={index === activeIndex}
              onClick={() => setActiveIndex(index)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.poster ?? item.src} alt="" draggable={false} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Block({
  block,
  project,
  preview = false,
  frameId,
}: {
  block: CaseBlock;
  project: Project;
  preview?: boolean;
  frameId?: string;
}) {
  if (block.type === "h3") return null;
  if (block.type === "p") return <p>{block.text}</p>;
  if (block.type === "ul" || block.type === "ol") {
    const List = block.type;
    return (
      <List>
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </List>
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
        className={preview ? `${styles.frame} ${styles.previewFrame}` : styles.frame}
        data-gl={preview ? undefined : "simple"}
        data-shadow=""
        data-id={preview ? undefined : frameId ?? `${project.slug}-${block.index}`}
        data-project={preview ? undefined : project.slug}
        data-stack-index={preview ? undefined : block.index}
        style={{ "--ratio": `${item.width} / ${item.height}` } as CSSProperties}
      >
        {item.video ? (
          <video
            src={item.src}
            poster={item.poster}
            muted
            loop
            playsInline
            autoPlay={!preview}
            preload="auto"
            crossOrigin="anonymous"
            draggable={false}
          />
        ) : (
          // Sampled by the shared plane. next/image would hide the source element.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.src} alt="" loading="eager" crossOrigin="anonymous" draggable={false} />
        )}
        {block.markers?.map((marker) => (
          <span
            key={marker.label}
            className={styles.marker}
            style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
            aria-hidden="true"
          >
            {marker.label}
          </span>
        ))}
      </div>
      {caption ? (
        <figcaption>
          <p>{caption}</p>
        </figcaption>
      ) : null}
    </figure>
  );
}
