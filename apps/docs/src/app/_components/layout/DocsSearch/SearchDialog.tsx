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
  Badge,
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
    if (hasQuery && results[activeIndex]) {
      input.setAttribute("aria-activedescendant", optionId(activeIndex));
    } else {
      input.removeAttribute("aria-activedescendant");
    }
  }, [activeIndex, results, hasQuery]);

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
    const target = result.hash
      ? `${result.entry.url}#${result.hash}`
      : result.entry.url;
    controller.close();
    router.push(target);
  };

  const onKeyDownCapture = (event: KeyboardEvent): void => {
    if (results.length === 0) {
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => Math.min(current + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => Math.max(current - 1, 0));
    } else if (event.key === "Enter") {
      const result = results[activeIndex];
      if (result) {
        event.preventDefault();
        openResult(result);
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

          {status === "loading" && (
            <Flex justify="center" padding="l">
              <LoadingSpinner />
            </Flex>
          )}

          {status === "error" && (
            <Text>
              Die Suche konnte nicht geladen werden. Bitte versuche es erneut.
            </Text>
          )}

          {index &&
            hasQuery &&
            (results.length > 0 ? (
              <Flex
                elementType="ul"
                direction="column"
                gap="xs"
                className={styles.results}
                role="listbox"
                aria-label="Suchergebnisse"
              >
                {results.map((result, resultIndex) => (
                  <li key={result.entry.id} role="presentation">
                    <a
                      ref={(element) => {
                        itemRefs.current[resultIndex] = element;
                      }}
                      id={optionId(resultIndex)}
                      role="option"
                      aria-selected={resultIndex === activeIndex}
                      href={
                        result.hash
                          ? `${result.entry.url}#${result.hash}`
                          : result.entry.url
                      }
                      className={clsx(
                        styles.result,
                        resultIndex === activeIndex && styles.active,
                      )}
                      onMouseMove={() => setActiveIndex(resultIndex)}
                      onClick={(event) => {
                        event.preventDefault();
                        openResult(result);
                      }}
                    >
                      <Flex direction="column" gap="xs">
                        <Flex direction="row" gap="s" align="center">
                          <Text className={styles.resultTitle}>
                            <HighlightedText segments={result.titleSegments} />
                          </Text>
                          {result.entry.tab && (
                            <Badge>{result.entry.tab}</Badge>
                          )}
                        </Flex>
                        <Text className={styles.meta}>
                          {result.entry.breadcrumb.join(" › ")}
                        </Text>
                        {result.snippet.length > 0 && (
                          <Text className={styles.snippet}>
                            <HighlightedText segments={result.snippet} />
                          </Text>
                        )}
                      </Flex>
                    </a>
                  </li>
                ))}
              </Flex>
            ) : (
              <Text>Keine Ergebnisse für „{query.trim()}“.</Text>
            ))}
        </Flex>
      </Content>
    </Modal>
  );
};

export default SearchDialog;
