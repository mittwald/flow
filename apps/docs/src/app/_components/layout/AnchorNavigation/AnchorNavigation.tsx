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

interface Props {
  anchors: string[];
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
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveAnchor(entry.target.id);
          }
        });
      },
      {
        rootMargin: "0px 0px -70% 0px",
        threshold: 0.1,
      },
    );

    anchors.forEach((a) => {
      const slug = slugify(a, { lower: true, strict: true });
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
            const slug = slugify(a, { lower: true, strict: true });

            return (
              <Link
                aria-current={slug === activeAnchor ? "page" : undefined}
                href={`${currentPath}#${slug}`}
                key={a}
              >
                {a}
              </Link>
            );
          })}
        </Navigation>
      </Section>
    </LayoutCard>
  );
};

export default AnchorNavigation;
