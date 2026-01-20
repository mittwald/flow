"use client";
import {
  Heading,
  LayoutCard,
  Link,
  Navigation,
  Section,
} from "@mittwald/flow-react-components";
import React, { type FC, useEffect } from "react";
import styles from "../../../layout.module.scss";
import slugify from "slugify";
import type { Anchor } from "@/lib/mdx/MdxFile";

interface Props {
  anchors: Anchor[];
  title: string;
  currentPath: string;
}

export const AnchorNavigation: FC<Props> = (props) => {
  const { anchors, title, currentPath } = props;

  const [activeAnchor, setActiveAnchor] = React.useState<string | null>(null);

  if (anchors.length === 0) {
    return null;
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveAnchor(visible[0]!.target.id);
        } else {
          const aboveViewport = anchors
            .map((a) => slugify(a.text, { lower: true, strict: true }))
            .map((id) => document.getElementById(id))
            .filter((el): el is HTMLElement => el !== null)
            .filter(
              (el) =>
                el.getBoundingClientRect().top < window.innerHeight * 0.25,
            )
            .pop();

          if (aboveViewport) {
            setActiveAnchor(aboveViewport.id);
          } else if (!activeAnchor && anchors.length > 0) {
            const firstSlug = slugify(anchors[0]!.text, {
              lower: true,
              strict: true,
            });
            setActiveAnchor(firstSlug);
          }
        }
      },
      {
        root: null,
        rootMargin: "-20% 0px -70% 0px",
        threshold: [0, 0.25, 0.5],
      },
    );
    anchors.forEach((a) => {
      const slug = slugify(a.text, { lower: true, strict: true });
      const el = document.getElementById(slug);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [anchors]);

  return (
    <LayoutCard className={styles.anchorNavigation}>
      <Section>
        <Heading level={4}>{title}</Heading>
        <Navigation>
          {anchors.map((a) => {
            const slug = slugify(a.text, { lower: true, strict: true });

            return (
              <Link
                aria-current={slug === activeAnchor ? "page" : undefined}
                href={`${currentPath}#${slug}`}
                key={a.text}
                style={{
                  marginInlineStart: a.level !== 2 ? "16px" : undefined,
                }}
              >
                {a.text}
              </Link>
            );
          })}
        </Navigation>
      </Section>
    </LayoutCard>
  );
};

export default AnchorNavigation;
