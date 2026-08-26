import type { MdxFile } from "@/lib/mdx/MdxFile";
import { pagePath } from "@/lib/llms/siteUrls";

const section = "04-components";

export interface ReplacementLink {
  name: string;
  href: string;
}

/**
 * Resolves a page's `replacedBy` frontmatter (component display names) to
 * links. Throws on an unknown name: silently dropping it would swallow the most
 * useful link on a deprecated page, and the build is where a typo should show.
 */
export const resolveReplacedBy = (
  mdxFile: MdxFile,
  componentPages: MdxFile[],
): ReplacementLink[] =>
  (mdxFile.mdxSource.frontmatter.replacedBy ?? []).map((name) => {
    const target = componentPages.find(
      (page) => page.mdxSource.frontmatter.component === name,
    );

    if (!target) {
      throw new Error(
        `replacedBy: "${name}" in ${mdxFile.filename} has no component page`,
      );
    }

    return {
      name: target.getNavTitle(),
      href: pagePath([section, ...target.slugs]),
    };
  });
