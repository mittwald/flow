import MiniSearch from "minisearch";
import type { SearchIndexEntry } from "@/lib/search/types";

export interface HighlightSegment {
  text: string;
  match: boolean;
}

export interface SearchResult {
  entry: SearchIndexEntry;
  score: number;
  titleSegments: HighlightSegment[];
  snippet: HighlightSegment[];
  hash?: string;
}

const FIELD_BOOST = {
  title: 12,
  tab: 2,
  breadcrumb: 4,
  description: 6,
  headings: 5,
  content: 1,
};

const SNIPPET_BEFORE = 60;
const SNIPPET_AFTER = 120;

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const highlight = (
  text: string,
  terms: string[],
): HighlightSegment[] => {
  const escaped = terms.filter(Boolean).map(escapeRegExp);
  if (escaped.length === 0 || text.length === 0) {
    return [{ text, match: false }];
  }

  const regexp = new RegExp(`(${escaped.join("|")})`, "gi");
  const segments: HighlightSegment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regexp.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: text.slice(lastIndex, match.index), match: false });
    }
    segments.push({ text: match[0], match: true });
    lastIndex = match.index + match[0].length;
    if (match.index === regexp.lastIndex) {
      regexp.lastIndex++;
    }
  }

  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex), match: false });
  }

  return segments.length > 0 ? segments : [{ text, match: false }];
};

const buildSnippet = (
  entry: SearchIndexEntry,
  terms: string[],
): HighlightSegment[] => {
  const source = entry.content || entry.description || "";
  if (source.length === 0) {
    return [];
  }

  const lowerSource = source.toLowerCase();
  let matchIndex = -1;
  for (const term of terms) {
    const index = lowerSource.indexOf(term);
    if (index !== -1 && (matchIndex === -1 || index < matchIndex)) {
      matchIndex = index;
    }
  }

  const start =
    matchIndex === -1 ? 0 : Math.max(0, matchIndex - SNIPPET_BEFORE);
  const end =
    matchIndex === -1
      ? Math.min(source.length, SNIPPET_BEFORE + SNIPPET_AFTER)
      : Math.min(source.length, matchIndex + SNIPPET_AFTER);

  let snippet = source.slice(start, end).trim();
  if (start > 0) {
    snippet = `… ${snippet}`;
  }
  if (end < source.length) {
    snippet = `${snippet} …`;
  }

  return highlight(snippet, terms);
};

const createIndex = (
  entries: SearchIndexEntry[],
): MiniSearch<SearchIndexEntry> => {
  const index = new MiniSearch<SearchIndexEntry>({
    fields: Object.keys(FIELD_BOOST),
    extractField: (entry, field) => {
      if (field === "breadcrumb") {
        return entry.breadcrumb.join(" ");
      }
      if (field === "headings") {
        return entry.headings.map((heading) => heading.text).join(" ");
      }
      return (entry[field as keyof SearchIndexEntry] as string) ?? "";
    },
    searchOptions: {
      boost: FIELD_BOOST,
      prefix: true,
      fuzzy: 0.2,
      combineWith: "AND",
    },
  });
  index.addAll(entries);
  return index;
};

const indexCache = new WeakMap<
  SearchIndexEntry[],
  { index: MiniSearch<SearchIndexEntry>; byId: Map<string, SearchIndexEntry> }
>();

const getIndex = (
  entries: SearchIndexEntry[],
): {
  index: MiniSearch<SearchIndexEntry>;
  byId: Map<string, SearchIndexEntry>;
} => {
  let cached = indexCache.get(entries);
  if (!cached) {
    cached = {
      index: createIndex(entries),
      byId: new Map(entries.map((entry) => [entry.id, entry])),
    };
    indexCache.set(entries, cached);
  }
  return cached;
};

export const searchDocs = (
  entries: SearchIndexEntry[],
  query: string,
  limit = 30,
): SearchResult[] => {
  const trimmed = query.trim();
  if (trimmed.length === 0) {
    return [];
  }
  const terms = trimmed.toLowerCase().split(/\s+/).filter(Boolean);
  const { index, byId } = getIndex(entries);

  return index
    .search(trimmed)
    .slice(0, limit)
    .flatMap((result) => {
      const entry = byId.get(String(result.id));
      if (!entry) {
        return [];
      }
      const hash = entry.headings.find(
        (heading) =>
          heading.slug !== undefined &&
          terms.some((term) => heading.text.toLowerCase().includes(term)),
      )?.slug;

      return [
        {
          entry,
          score: result.score,
          titleSegments: highlight(entry.title, terms),
          snippet: buildSnippet(entry, terms),
          hash,
        },
      ];
    });
};
