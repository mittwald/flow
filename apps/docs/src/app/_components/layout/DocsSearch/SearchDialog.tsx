"use client";

import {
  type FC,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Content,
  Flex,
  Heading,
  LoadingSpinner,
  Modal,
  type OverlayController,
  SearchField,
  Text,
} from "@mittwald/flow-react-components";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import type { SearchIndexEntry } from "@/lib/search/types";
import {
  type HighlightSegment,
  type SearchResult,
  searchDocs,
} from "@/lib/search/searchDocs";
import styles from "./DocsSearch.module.scss";

interface Props {
  controller: OverlayController;
}

type LoadStatus = "idle" | "loading" | "error";

const RESULT_LIMIT = 20;

const DEFAULT_SECTIONS = [
  {
    segment: "01-get-started",
    title: "Get started",
    description:
      "Alles für den Einstieg in flow – von den wichtigsten Grundlagen bis zu ersten Schritten für einen schnellen Start.",
  },
  {
    segment: "02-foundations",
    title: "Foundations",
    description:
      "Die Grundlagen des Designsystems – von Designprinzipien bis zu Farben, Typografie und weiteren Basisbausteinen.",
  },
  {
    segment: "03-patterns",
    title: "Patterns",
    description:
      "Wiederkehrende Nutzerabläufe und Best Practices, die zeigen, wie mehrere Components sinnvoll zusammenspielen.",
  },
  {
    segment: "04-components",
    title: "Components",
    description:
      "Die Dokumentation aller Components mit Beschreibungen, Eigenschaften, Anwendungsfällen und Implementierungshinweisen.",
  },
];

const searchIndexUrl = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/search-index`;

const optionId = (index: number): string => `docs-search-result-${index}`;

const HighlightedText: FC<{ segments: HighlightSegment[] }> = ({
  segments,
}) => (
  <>
    {segments.map((segment, index) =>
      segment.match ? (
        <mark key={index} className={styles.mark}>
          {segment.text}
        </mark>
      ) : (
        <span key={index}>{segment.text}</span>
      ),
    )}
  </>
);

export const SearchDialog: FC<Props> = ({ controller }) => {
  const router = useRouter();

  const [index, setIndex] = useState<SearchIndexEntry[] | null>(null);
  const [status, setStatus] = useState<LoadStatus>("idle");
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const loadStartedRef = useRef(false);

  const results = useMemo(
    () => (index ? searchDocs(index, query, RESULT_LIMIT) : []),
    [index, query],
  );

  const hasQuery = query.trim().length > 0;

  const items = useMemo<SearchResult[]>(() => {
    if (hasQuery) {
      return results;
    }
    if (!index) {
      return [];
    }
    return DEFAULT_SECTIONS.flatMap((section) => {
      const inSection = index.filter((entry) =>
        entry.url.startsWith(`/${section.segment}/`),
      );
      const landing =
        inSection.find((entry) => entry.url.endsWith("/overview")) ??
        inSection[0];
      if (!landing) {
        return [];
      }
      return [
        {
          entry: {
            id: section.segment,
            url: landing.url,
            title: section.title,
            section: section.title,
            breadcrumb: [],
            headings: [],
            content: "",
          },
          score: 0,
          titleSegments: [{ text: section.title, match: false }],
          snippet: [{ text: section.description, match: false }],
        },
      ];
    });
  }, [hasQuery, results, index]);

  const loadIndex = useCallback(() => {
    if (loadStartedRef.current) {
      return;
    }
    loadStartedRef.current = true;
    setStatus("loading");
    void fetch(searchIndexUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Search index request failed: ${response.status}`);
        }
        return response.json() as Promise<SearchIndexEntry[]>;
      })
      .then((data) => {
        setIndex(data);
        setStatus("idle");
      })
      .catch(() => {
        loadStartedRef.current = false;
        setStatus("error");
      });
  }, []);

  useEffect(() => {
    const requestIdle = window.requestIdleCallback;
    const cancelIdle = window.cancelIdleCallback;
    if (requestIdle && cancelIdle) {
      const handle = requestIdle(() => loadIndex(), { timeout: 3000 });
      return () => cancelIdle(handle);
    }
    const handle = window.setTimeout(loadIndex, 1500);
    return () => window.clearTimeout(handle);
  }, [loadIndex]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    itemRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });

    const input = inputRef.current;
    if (!input) {
      return;
    }
    if (items[activeIndex]) {
      input.setAttribute("aria-activedescendant", optionId(activeIndex));
    } else {
      input.removeAttribute("aria-activedescendant");
    }
  }, [activeIndex, items]);

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        controller.open();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [controller]);

  const openResult = (result: SearchResult): void => {
    controller.close();
    router.push(
      result.hash ? `${result.entry.url}#${result.hash}` : result.entry.url,
    );
  };

  const onKeyDownCapture = (event: KeyboardEvent): void => {
    if (items.length === 0) {
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => Math.min(current + 1, items.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => Math.max(current - 1, 0));
    } else if (event.key === "Enter") {
      const item = items[activeIndex];
      if (item) {
        event.preventDefault();
        openResult(item);
      }
    }
  };

  return (
    <Modal
      controller={controller}
      size="m"
      onOpen={() => {
        setQuery("");
        loadIndex();
      }}
    >
      <Heading>Suche</Heading>
      <Content>
        <Flex direction="column" gap="m" onKeyDownCapture={onKeyDownCapture}>
          <SearchField
            ref={inputRef}
            autoFocus
            aria-label="Dokumentation durchsuchen"
            value={query}
            onChange={setQuery}
          />

          {hasQuery && !index && status === "loading" ? (
            <Flex justify="center" padding="l">
              <LoadingSpinner />
            </Flex>
          ) : hasQuery && !index && status === "error" ? (
            <Text>
              Die Suche konnte nicht geladen werden. Bitte versuche es erneut.
            </Text>
          ) : hasQuery && index && items.length === 0 ? (
            <Text>Keine Ergebnisse für „{query.trim()}“.</Text>
          ) : (
            <Flex
              elementType="ul"
              direction="column"
              gap="xs"
              className={styles.results}
              role="listbox"
              aria-label={hasQuery ? "Suchergebnisse" : "Bereiche"}
            >
              {items.map((item, itemIndex) => {
                const breadcrumb = [...item.entry.breadcrumb, item.entry.tab]
                  .filter(Boolean)
                  .join(" › ");
                return (
                  <li key={item.entry.id} role="presentation">
                    <a
                      ref={(element) => {
                        itemRefs.current[itemIndex] = element;
                      }}
                      id={optionId(itemIndex)}
                      role="option"
                      aria-selected={itemIndex === activeIndex}
                      href={
                        item.hash
                          ? `${item.entry.url}#${item.hash}`
                          : item.entry.url
                      }
                      className={clsx(
                        styles.result,
                        itemIndex === activeIndex && styles.active,
                      )}
                      onMouseMove={() => setActiveIndex(itemIndex)}
                      onClick={(event) => {
                        event.preventDefault();
                        openResult(item);
                      }}
                    >
                      <Flex direction="column" gap="xs">
                        <Text className={styles.resultTitle}>
                          <HighlightedText segments={item.titleSegments} />
                        </Text>
                        {breadcrumb && (
                          <Text className={styles.meta}>{breadcrumb}</Text>
                        )}
                        {item.snippet.length > 0 && (
                          <Text className={styles.snippet}>
                            <HighlightedText segments={item.snippet} />
                          </Text>
                        )}
                      </Flex>
                    </a>
                  </li>
                );
              })}
            </Flex>
          )}
        </Flex>
      </Content>
    </Modal>
  );
};

export default SearchDialog;
