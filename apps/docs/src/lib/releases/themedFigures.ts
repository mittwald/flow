const PICTURE = /<picture>([\s\S]*?)<\/picture>/g;

/** A fenced code block, whose content is shown as written. */
const FENCE = /(^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\2[^\n]*$)/m;

const DARK_MEDIA = "(prefers-color-scheme:dark)";
const LIGHT_MEDIA = "(prefers-color-scheme:light)";

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
};

const attribute = (tag: string, name: string): string | undefined => {
  const match = tag.match(
    new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`),
  );
  return (match?.[1] ?? match?.[2])
    ?.trim()
    .replace(/&(amp|lt|gt|quot|#39);/g, (entity) => ENTITIES[entity] ?? "");
};

class UnreadableFigure extends Error {}

const fail = (reason: string): never => {
  throw new UnreadableFigure(reason);
};

const rewrite = (inner: string): string => {
  const img = inner.match(/<img\b[^>]*>/)?.[0];
  const light = (img && attribute(img, "src")) || fail("no <img src>");
  const alt = (attribute(img ?? "", "alt") ?? "").replace(/[\\[\]]/g, "\\$&");

  const media = (source: string) =>
    attribute(source, "media")?.replace(/\s+/g, "");
  const sources = inner.match(/<source\b[^>]*>/g) ?? [];
  if (
    sources.some(
      (source) => ![DARK_MEDIA, LIGHT_MEDIA].includes(media(source) ?? ""),
    )
  ) {
    fail(`a <source> media other than ${DARK_MEDIA} or ${LIGHT_MEDIA}`);
  }
  const darkSources = sources.filter((source) => media(source) === DARK_MEDIA);
  if (darkSources.length > 1) {
    fail(`more than one ${DARK_MEDIA} <source>`);
  }
  if (!darkSources[0]) {
    return `![${alt}](${light})`;
  }
  // A srcset is a candidate list; the figure only ever has one.
  const dark =
    attribute(darkSources[0], "srcset")?.split(/\s+/)[0] ||
    fail("no <source srcset>");

  return `![${alt}](${light}#light-only)\n![${alt}](${dark}#dark-only)`;
};

/**
 * Rewrite a release figure's `<picture>` block into markdown images.
 *
 * The notes offer each figure's dark capture through `<source
 * media="(prefers-color-scheme: dark)">`, which GitHub honours. The docs'
 * `<Markdown>` drops raw HTML, so the block would vanish here entirely. It
 * becomes one image per theme instead, tagged `#light-only` / `#dark-only` for
 * `ReleaseEntry.module.scss` to show the one matching `data-theme` — which also
 * follows the docs' own theme toggle, not just the system setting.
 *
 * A block it cannot read is reported through `onUnreadable` and shown as code,
 * so it stays visible. It does not throw: the bodies are live data from GitHub,
 * and one bad block would fail every docs build until someone edits the
 * release. Fenced code blocks are left alone.
 */
export const themedFigures = (
  body: string,
  onUnreadable: (reason: string) => void,
): string =>
  body
    .split(FENCE)
    // `split` interleaves the two capture groups: text, fence, fence marker, …
    .filter((_, index) => index % 3 !== 2)
    .map((part, index) =>
      index % 2 === 1
        ? part
        : part.replace(PICTURE, (block, inner: string) => {
            try {
              return rewrite(inner);
            } catch (error) {
              if (!(error instanceof UnreadableFigure)) throw error;
              onUnreadable(error.message);
              return `\`\`\`html\n${block}\n\`\`\``;
            }
          }),
    )
    .join("");
