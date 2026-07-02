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

const FIELD_WEIGHTS = {
  title: 12,
  tab: 2,
  breadcrumb: 4,
  description: 6,
  heading: 5,
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

export const searchDocs = (
  entries: SearchIndexEntry[],
  query: string,
  limit = 30,
): SearchResult[] => {
  const normalizedQuery = query.trim().toLowerCase();
  if (normalizedQuery.length === 0) {
    return [];
  }
  const terms = normalizedQuery.split(/\s+/).filter(Boolean);

  const results: SearchResult[] = [];

  for (const entry of entries) {
    const title = entry.title.toLowerCase();
    const tab = entry.tab?.toLowerCase() ?? "";
    const breadcrumb = entry.breadcrumb.join(" ").toLowerCase();
    const description = entry.description?.toLowerCase() ?? "";
    const headingsText = entry.headings
      .map((heading) => heading.text)
      .join(" ")
      .toLowerCase();
    const content = entry.content.toLowerCase();

    let score = 0;
    let matchesAllTerms = true;

    for (const term of terms) {
      let termScore = 0;

      if (title.includes(term)) {
        termScore += FIELD_WEIGHTS.title;
        if (title === term) {
          termScore += 20;
        } else if (title.startsWith(term)) {
          termScore += 6;
        }
      }
      if (tab.includes(term)) {
        termScore += FIELD_WEIGHTS.tab;
      }
      if (breadcrumb.includes(term)) {
        termScore += FIELD_WEIGHTS.breadcrumb;
      }
      if (description.includes(term)) {
        termScore += FIELD_WEIGHTS.description;
      }
      if (headingsText.includes(term)) {
        termScore += FIELD_WEIGHTS.heading;
      }
      if (content.includes(term)) {
        termScore += FIELD_WEIGHTS.content;
      }

      if (termScore === 0) {
        matchesAllTerms = false;
        break;
      }
      score += termScore;
    }

    if (!matchesAllTerms) {
      continue;
    }

    if (terms.length > 1) {
      if (title.includes(normalizedQuery)) {
        score += 15;
      }
      if (
        content.includes(normalizedQuery) ||
        description.includes(normalizedQuery)
      ) {
        score += 5;
      }
    }

    const matchingHeading = entry.headings.find(
      (heading) =>
        heading.slug !== undefined &&
        terms.some((term) => heading.text.toLowerCase().includes(term)),
    );

    results.push({
      entry,
      score,
      titleSegments: highlight(entry.title, terms),
      snippet: buildSnippet(entry, terms),
      hash: matchingHeading?.slug,
    });
  }

  results.sort(
    (a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title),
  );

  return results.slice(0, limit);
};
