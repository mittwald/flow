import matter from "gray-matter";
import jetpack from "fs-jetpack";
import path from "path";
import humanizeString from "humanize-string";
import { mdxToMarkdown } from "@/lib/llms/mdxToMarkdown";
import { byContentOrder } from "@/lib/content/contentOrder";

const CONTENT_ROOT = "./src/content";
const COMPONENTS_SECTION = "components";

export interface DocPage {
  segments: string[];
  title: string;
  description?: string;
  toMarkdown: () => string;
}

interface Frontmatter {
  title?: string;
  component?: string;
  description?: string;
}

const readFrontmatter = (filePath: string): Frontmatter =>
  matter(jetpack.read(filePath) ?? "").data as Frontmatter;

const normalizeWhitespace = (value: string | undefined): string =>
  (value ?? "").replace(/\s+/g, " ").trim();

const pageHeader = (title: string, description?: string): string =>
  description ? `# ${title}\n\n${description}` : `# ${title}`;

const componentPages = (): DocPage[] => {
  const sectionDir = path.join(CONTENT_ROOT, COMPONENTS_SECTION);
  const indexFiles = jetpack.find(sectionDir, { matching: "*/*/index.mdx" });

  // A component is a single index.mdx that already contains the whole page.
  return indexFiles.map((indexFile) => {
    const relativeSegments = path
      .relative(sectionDir, indexFile)
      .split(path.sep);
    const group = relativeSegments[0] ?? "";
    const component = relativeSegments[1] ?? "";
    const frontmatter = readFrontmatter(indexFile);
    const componentName = frontmatter.component ?? humanizeString(component);
    const title = frontmatter.title ?? componentName;
    const description = normalizeWhitespace(frontmatter.description);
    const header = pageHeader(title, description);

    return {
      segments: [COMPONENTS_SECTION, group, component],
      title,
      description,
      toMarkdown: () =>
        `${header}\n\n${mdxToMarkdown(indexFile, { componentName })}\n`,
    };
  });
};

const slugPages = (section: string): DocPage[] => {
  const sectionDir = path.join(CONTENT_ROOT, section);
  const indexFiles = jetpack.find(sectionDir, { matching: "**/index.mdx" });

  return indexFiles.map((indexFile) => {
    const relativeDir = path.dirname(path.relative(sectionDir, indexFile));
    const slug = relativeDir === "." ? [] : relativeDir.split(path.sep);
    const frontmatter = readFrontmatter(indexFile);
    const title =
      frontmatter.title ?? humanizeString(slug[slug.length - 1] ?? section);
    const description = normalizeWhitespace(frontmatter.description);

    return {
      segments: [section, ...slug],
      title,
      description,
      toMarkdown: () => {
        const body = mdxToMarkdown(indexFile);
        return /^\s*#\s/.test(body) ? body : `${pageHeader(title)}\n\n${body}`;
      },
    };
  });
};

export const getAllDocPages = (): DocPage[] => {
  const sections = (jetpack.list(CONTENT_ROOT) ?? []).filter(
    (name) => jetpack.exists(path.join(CONTENT_ROOT, name)) === "dir",
  );

  return sections
    .flatMap((section) =>
      section === COMPONENTS_SECTION ? componentPages() : slugPages(section),
    )
    .sort(
      (a, b) =>
        byContentOrder(
          `/${a.segments.join("/")}`,
          `/${b.segments.join("/")}`,
        ) || a.segments.join("/").localeCompare(b.segments.join("/")),
    );
};
