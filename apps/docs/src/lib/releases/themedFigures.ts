const PICTURE = /<picture>([\s\S]*?)<\/picture>/g;

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
};

const attribute = (tag: string, name: string): string | undefined =>
  tag
    .match(new RegExp(`\\s${name}\\s*=\\s*"([^"]*)"`))?.[1]
    ?.trim()
    .replace(/&(amp|lt|gt|quot|#39);/g, (entity) => ENTITIES[entity] ?? "");

/**
 * Rewrite a release figure's `<picture>` block into markdown images.
 *
 * The notes offer each figure's dark capture through `<source
 * media="(prefers-color-scheme: dark)">`, which GitHub honours. The docs'
 * `<Markdown>` drops raw HTML, so the block would vanish here entirely. It
 * becomes one image per theme instead, tagged `#light-only` / `#dark-only` for
 * `ReleaseEntry.module.scss` to show the one matching `data-theme` — which also
 * follows the docs' own theme toggle, not just the system setting.
 */
export const themedFigures = (body: string): string =>
  body.replace(PICTURE, (block, inner: string) => {
    const img = inner.match(/<img\b[^>]*>/)?.[0];
    const light = img && attribute(img, "src");
    if (!img || !light) {
      return block;
    }
    const alt = (attribute(img, "alt") ?? "").replace(/[\\[\]]/g, "\\$&");
    const dark = (inner.match(/<source\b[^>]*>/g) ?? [])
      .filter((source) =>
        attribute(source, "media")?.includes("prefers-color-scheme: dark"),
      )
      // A srcset is a candidate list; the figure only ever has one.
      .map((source) => attribute(source, "srcset")?.split(/\s+/)[0])
      .find(Boolean);

    if (!dark) {
      return `![${alt}](${light})`;
    }
    return `![${alt}](${light}#light-only)\n![${alt}](${dark}#dark-only)`;
  });
