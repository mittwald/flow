export interface FoundLink {
  /** The raw link target, exactly as written. */
  href: string;
  /** Path of the file the link was found in, for the error message. */
  file: string;
  /** 1-based line number, for the error message. */
  line: number;
  /**
   * Pathname of the page this file renders, if it renders one. Only set for
   * content files — a bare `#fragment` can only be resolved against its own
   * page.
   */
  page?: string;
}

const MARKDOWN_LINK = /\]\(\s*([^)\s]+)[^)]*\)/g;
const JSX_HREF = /href=["']([^"']*)["']/g;
const FENCE = /^\s*```/;
const INLINE_CODE = /`[^`]*`/g;

const extract = (
  source: string,
  file: string,
  patterns: RegExp[],
  page?: string,
): FoundLink[] => {
  const links: FoundLink[] = [];
  let insideFence = false;

  source.split("\n").forEach((rawLine, index) => {
    if (FENCE.test(rawLine)) {
      insideFence = !insideFence;
      return;
    }
    if (insideFence) {
      return;
    }

    const line = rawLine.replaceAll(INLINE_CODE, "");

    for (const pattern of patterns) {
      for (const match of line.matchAll(pattern)) {
        links.push({ href: match[1] ?? "", file, line: index + 1, page });
      }
    }
  });

  return links;
};

/**
 * Collects the links of an MDX page: markdown `[text](target)` and JSX
 * `href="target"`.
 *
 * Fenced and inline code are stripped first. A link inside a code sample
 * documents syntax, it does not navigate anywhere — reporting it would be a
 * false positive, and a check that cries wolf gets switched off. Stripping
 * happens line by line so the reported line numbers stay correct.
 *
 * Frontmatter is deliberately _not_ stripped: markdown links in frontmatter
 * (such as a `deprecationNotice` pointing at the successor component) render as
 * real links and are checked like any other.
 */
export const extractMdxLinks = (
  source: string,
  file: string,
  page?: string,
): FoundLink[] => extract(source, file, [MARKDOWN_LINK, JSX_HREF], page);

/**
 * Collects the hardcoded links of a TypeScript source file — `href="target"`
 * only.
 *
 * Markdown link syntax is deliberately ignored here: in TS sources a `](…)` is
 * regex or string content (a markdown _generator_, a replacement pattern),
 * never a link that navigates. Matching it reported `$1` and `.*` as broken
 * pages.
 */
export const extractSourceLinks = (source: string, file: string): FoundLink[] =>
  extract(source, file, [JSX_HREF]);
