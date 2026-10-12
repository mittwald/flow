const PICTURE = /<picture>([\s\S]*?)<\/picture>/g;

const DARK_MEDIA = "(prefers-color-scheme:dark)";

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
 * A block it cannot read throws instead: left as it is, it would disappear from
 * `/releases` without a trace.
 */
export const themedFigures = (body: string): string =>
  body.replace(PICTURE, (block, inner: string) => {
    const fail = (reason: string): never => {
      throw new Error(`Unreadable release figure (${reason}):\n${block}`);
    };

    const img = inner.match(/<img\b[^>]*>/)?.[0];
    const light = (img && attribute(img, "src")) || fail("no <img src>");
    const alt = (attribute(img ?? "", "alt") ?? "").replace(/[\\[\]]/g, "\\$&");

    const sources = inner.match(/<source\b[^>]*>/g) ?? [];
    if (sources.length > 1) {
      fail("more than one <source>");
    }
    const source = sources[0];
    if (!source) {
      return `![${alt}](${light})`;
    }
    const media = attribute(source, "media")?.replace(/\s+/g, "");
    if (media !== DARK_MEDIA) {
      fail(`<source> media is not ${DARK_MEDIA}`);
    }
    // A srcset is a candidate list; the figure only ever has one.
    const dark =
      attribute(source, "srcset")?.split(/\s+/)[0] ||
      fail("no <source srcset>");

    return `![${alt}](${light}#light-only)\n![${alt}](${dark}#dark-only)`;
  });
