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

// Duplicates the headings' `scroll-margin-top`: a heading counts as reached
// once it crosses the line an anchor jump puts it on.
const activeLineOffset = 96;

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

  // The MDX content renders on the client, so the browser's own jump to the
  // hash happens while the headings don't exist yet. Repeat it once the content
  // is there.
  useEffect(() => {
    if (!ready || initialScrollProcessed.current) {
      return;
    }

    const slug = decodeURIComponent(window.location.hash.slice(1));
    if (!slug) {
      return;
    }

    initialScrollProcessed.current = true;
    document.getElementById(slug)?.scrollIntoView();
  }, [ready]);

  const [activeAnchor, setActiveAnchor] = React.useState<string | null>(null);

  useEffect(() => {
    const updateActiveAnchor = () => {
      const passed = anchors
        .map((a) => ({ slug: a.slug, el: document.getElementById(a.slug) }))
        .filter((a): a is { slug: string; el: HTMLElement } => a.el !== null)
        .filter(({ el }) => el.getBoundingClientRect().top <= activeLineOffset);

      setActiveAnchor(passed.at(-1)?.slug ?? anchors[0]?.slug ?? null);
    };

    let frame = 0;
    const scheduleUpdate = () => {
      if (frame !== 0) {
        return;
      }
      frame = requestAnimationFrame(() => {
        frame = 0;
        updateActiveAnchor();
      });
    };

    updateActiveAnchor();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame !== 0) {
        cancelAnimationFrame(frame);
      }
    };
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
