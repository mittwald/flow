import matter from "gray-matter";
import jetpack from "fs-jetpack";
import path from "path";
import humanizeString from "humanize-string";
import { mdxToMarkdown } from "@/lib/llms/mdxToMarkdown";

const CONTENT_ROOT = "./src/content";
const COMPONENTS_SECTION = "04-components";
const COMPONENT_TABS = ["overview", "develop", "guidelines"] as const;

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

const capitalize = (value: string): string =>
  value.charAt(0).toUpperCase() + value.slice(1);

const pageHeader = (title: string, description?: string): string =>
  description ? `# ${title}\n\n${description}` : `# ${title}`;

const componentPages = (): DocPage[] => {
  const sectionDir = path.join(CONTENT_ROOT, COMPONENTS_SECTION);
  const indexFiles = jetpack.find(sectionDir, { matching: "*/*/index.mdx" });

  return indexFiles.flatMap((indexFile) => {
    const relativeSegments = path
      .relative(sectionDir, indexFile)
      .split(path.sep);
    const group = relativeSegments[0] ?? "";
    const component = relativeSegments[1] ?? "";
    const dir = path.dirname(indexFile);
    const frontmatter = readFrontmatter(indexFile);
    const componentName = frontmatter.component ?? humanizeString(component);
    const title = frontmatter.title ?? componentName;
    const description = normalizeWhitespace(frontmatter.description);
    const header = pageHeader(title, description);

    const availableTabs = COMPONENT_TABS.filter((tab) =>
      Boolean(jetpack.exists(path.join(dir, `${tab}.mdx`))),
    );

    const renderTab = (tab: (typeof COMPONENT_TABS)[number]): string =>
      mdxToMarkdown(path.join(dir, `${tab}.mdx`), { componentName });

    const fullPage: DocPage = {
      segments: [COMPONENTS_SECTION, group, component],
      title,
      description,
      toMarkdown: () =>
        `${[
          header,
          ...availableTabs.map(
            (tab) => `## ${capitalize(tab)}\n\n${renderTab(tab)}`,
          ),
        ].join("\n\n")}\n`,
    };

    const tabPages: DocPage[] = availableTabs.map((tab) => ({
      segments: [COMPONENTS_SECTION, group, component, tab],
      title: `${title} – ${capitalize(tab)}`,
      description,
      toMarkdown: () =>
        `${[header, `## ${capitalize(tab)}\n\n${renderTab(tab)}`].join("\n\n")}\n`,
    }));

    return [fullPage, ...tabPages];
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
    .sort((a, b) => a.segments.join("/").localeCompare(b.segments.join("/")));
};
