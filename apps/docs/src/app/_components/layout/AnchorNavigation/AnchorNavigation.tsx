"use client";
import {
  Heading,
  LayoutCard,
  Link,
  Navigation,
  Section,
} from "@mittwald/flow-react-components";
import React, { type FC, useEffect, useRef } from "react";
import globalStyles from "../../../layout.module.scss";
import type { Anchor } from "@/lib/mdx/MdxFile";
import styles from "./AnchorNavigation.module.scss";
import { useMdxStatus } from "@/lib/mdx/components/MdxFileView/MdxFileView";

interface Props {
  anchors: Anchor[];
  currentPath: string;
}

// Next.js patches the instance method `window.history.replaceState`, to update
// his internal router – this triggers a rerender and interferes with the scrolling.
// so we use the native replace state.
const nativeReplaceState =
  typeof History !== "undefined" ? History.prototype.replaceState : undefined;

const updateLocationHash = (slug: string) => {
  if (!nativeReplaceState) {
    return;
  }

  const encoded = encodeURIComponent(slug);
  if (window.location.hash.slice(1) === encoded) {
    return;
  }

  const url = window.location.pathname + window.location.search + `#${encoded}`;
  nativeReplaceState.call(window.history, window.history.state, "", url);
};

export const AnchorNavigation: FC<Props> = (props) => {
  const { anchors, currentPath } = props;
  const { ready } = useMdxStatus();

  const initialScrollProcessed = useRef<boolean>(false);
  useEffect(() => {
    const prev = history.scrollRestoration;
    history.scrollRestoration = "manual";

    return () => {
      history.scrollRestoration = prev;
    };
  }, []);

  const [activeAnchor, setActiveAnchor] = React.useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        const [firstVisible] = visible;
        if (firstVisible) {
          setActiveAnchor(firstVisible.target.id);
        } else {
          const currentUrlSlug = window.location.hash.slice(1);
          const aboveViewport = anchors
            .map((a) => {
              const slugElement = document.getElementById(a.slug);

              if (!initialScrollProcessed.current) {
                initialScrollProcessed.current = true;
                if (
                  currentUrlSlug &&
                  currentUrlSlug === encodeURIComponent(a.slug)
                ) {
                  slugElement?.scrollIntoView();
                }
              }

              return slugElement;
            })
            .filter((el): el is HTMLElement => el !== null)
            .filter(
              (el) =>
                el.getBoundingClientRect().top < window.innerHeight * 0.25,
            )
            .pop();

          if (aboveViewport) {
            setActiveAnchor(aboveViewport.id);
          } else if (!activeAnchor && anchors[0]) {
            setActiveAnchor(anchors[0].slug);
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
      const el = document.getElementById(a.slug);
      if (el) {
        observer.unobserve(el);
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [anchors, ready]);

  if (anchors.length === 0) {
    return null;
  }

  return (
    <LayoutCard className={globalStyles.anchorNavigation}>
      <Section>
        <Heading level={4}>Auf dieser Seite</Heading>
        <Navigation className={styles.navigation}>
          {anchors.map((a) => {
            return (
              <Link
                className={styles.anchorLink}
                aria-current={a.slug === activeAnchor ? "page" : undefined}
                href={`${currentPath}#${a.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveAnchor(a.slug);
                  updateLocationHash(a.slug);
                  document.getElementById(a.slug)?.scrollIntoView();
                }}
                key={a.slug}
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
