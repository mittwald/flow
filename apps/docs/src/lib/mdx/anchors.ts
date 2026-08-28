import slugify from "slugify";
import type { Anchor } from "@/lib/mdx/MdxFile";

/**
 * Turns heading text into the URL fragment the rendered page uses. Kept in one
 * place because both the page (via `MdxFileFactory`/`AnchorLinkHeading`) and
 * the link check derive fragments from it — two implementations would drift and
 * the check would start validating against anchors that never render.
 */
export const anchorSlug = (text: string): string =>
  slugify(text, { lower: true, strict: true });

/**
 * Extracts the anchors of an MDX page. An `## h2` is nested under the preceding
 * `# h1`, so its fragment combines both texts.
 */
export const extractAnchors = (fileContent: string): Anchor[] => {
  let currentH1: string;

  return fileContent
    .split("\n")
    .filter((line) => line.startsWith("# ") || line.startsWith("## "))
    .map((line) => {
      if (line.startsWith("# ")) {
        const text = line.substring(2).trim().replaceAll(".", "");
        currentH1 = text;

        return {
          slug: anchorSlug(text),
          text,
          level: 2,
        };
      }

      const h2Text = line.substring(3).trim();

      return {
        slug: anchorSlug(currentH1 ? `${currentH1}-${h2Text}` : h2Text),
        text: h2Text,
        level: 3,
      };
    });
};
