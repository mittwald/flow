import { MdxFileFactory } from "@/lib/mdx/MdxFileFactory";
import type { MdxFile } from "@/lib/mdx/MdxFile";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://mittwald.github.io/flow"
).replace(/\/$/, "");

interface Section {
  contentFolder: string;
  routeSegment: string;
  heading: string;
  toPathname: (mdxFile: MdxFile) => string;
}

const sections: Section[] = [
  {
    contentFolder: "src/content/01-get-started",
    routeSegment: "01-get-started",
    heading: "Get Started",
    toPathname: (mdx) => `/01-get-started/${mdx.slugs.join("/")}`,
  },
  {
    contentFolder: "src/content/02-foundations",
    routeSegment: "02-foundations",
    heading: "Foundations",
    toPathname: (mdx) => `/02-foundations/${mdx.slugs.join("/")}`,
  },
  {
    contentFolder: "src/content/03-patterns",
    routeSegment: "03-patterns",
    heading: "Patterns",
    toPathname: (mdx) => `/03-patterns/${mdx.slugs.join("/")}`,
  },
  {
    contentFolder: "src/content/04-components",
    routeSegment: "04-components",
    heading: "Components",
    toPathname: (mdx) => `/04-components/${mdx.slugs.join("/")}/overview`,
  },
];

const normalizeWhitespace = (value: string): string =>
  value.replace(/\s+/g, " ").trim();

const toListItem = (mdxFile: MdxFile, section: Section): string => {
  const title = mdxFile.getTitle();
  const url = `${siteUrl}${section.toPathname(mdxFile)}`;
  const description = mdxFile.mdxSource.frontmatter.description;

  const suffix = description ? `: ${normalizeWhitespace(description)}` : "";
  return `- [${title}](${url})${suffix}`;
};

const renderSection = async (section: Section): Promise<string> => {
  const mdxFiles = await MdxFileFactory.fromDir(section.contentFolder);

  const items = mdxFiles
    .sort((a, b) => a.filename.localeCompare(b.filename))
    .map((mdxFile) => toListItem(mdxFile, section));

  return [`## ${section.heading}`, "", ...items].join("\n");
};

export const generateLlmsTxt = async (): Promise<string> => {
  const renderedSections = await Promise.all(sections.map(renderSection));

  const header = [
    "# mittwald Flow",
    "",
    "> Flow is the design system of mittwald. It provides accessible, " +
      "brand-aligned React components, design tokens and patterns for " +
      "building consistent mStudio user interfaces. This documentation is " +
      "written in German.",
    "",
    "The React components are published as `@mittwald/flow-react-components`. " +
      "Source code and issues live at https://github.com/mittwald/flow.",
  ].join("\n");

  return [header, "", ...renderedSections, ""].join("\n\n");
};
