import { MdxFileFactory } from "@/lib/mdx/MdxFileFactory";
import type { MdxFile } from "@/lib/mdx/MdxFile";
import path from "path";
import fs from "fs";
import { byContentOrder } from "@/lib/content/contentOrder";

interface Section {
  contentFolder: string;
  routeSegment: string;
  heading: string;
  toPathname: (mdxFile: MdxFile) => string;
}

const contentFolder = "./src/content";
// `readdirSync` is alphabetical; the sections follow the authored order.
const directorySections = fs
  .readdirSync(contentFolder)
  .sort((a, b) => byContentOrder(`/${a}`, `/${b}`));
const sections: Section[] = directorySections.map((s) => {
  return {
    contentFolder: path.join(contentFolder, s),
    routeSegment: s,
    heading: s
      .split("-")
      .map(
        (word) =>
          `${word.charAt(0).toUpperCase()}${word.substring(1, word.length)}`,
      )
      .join(" "),
    toPathname: (mdx) => `/${s}/${mdx.slugs.join("/")}`,
  };
});

const normalizeWhitespace = (value: string): string =>
  value.replace(/\s+/g, " ").trim();

const toListItem = (
  siteUrl: string,
  mdxFile: MdxFile,
  section: Section,
): string => {
  const title = mdxFile.getTitle();
  const url = `${siteUrl}${section.toPathname(mdxFile)}`;
  const description = mdxFile.mdxSource.frontmatter.description;

  const suffix = description ? `: ${normalizeWhitespace(description)}` : "";
  return `- [${title}](${url})${suffix}`;
};

const renderSection = async (
  siteUrl: string,
  section: Section,
): Promise<string> => {
  const mdxFiles = await MdxFileFactory.fromDir(section.contentFolder);

  const items = mdxFiles
    .sort(
      (a, b) =>
        byContentOrder(section.toPathname(a), section.toPathname(b)) ||
        a.filename.localeCompare(b.filename),
    )
    .map((mdxFile) => toListItem(siteUrl, mdxFile, section));

  return [`## ${section.heading}`, "", ...items].join("\n");
};

export const generateLlmsTxt = async (siteUrl: string): Promise<string> => {
  const normalizedSiteUrl = siteUrl.replace(/\/$/, "");
  const renderedSections = await Promise.all(
    sections.map((s) => renderSection(normalizedSiteUrl, s)),
  );

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
    "",
    `For machine-readable Markdown, fetch [${normalizedSiteUrl}/llms-full.txt]` +
      `(${normalizedSiteUrl}/llms-full.txt) for the full documentation, or get a ` +
      "single page by prefixing its path with `/raw/` and appending `.md` " +
      `(e.g. ${normalizedSiteUrl}/raw/components/actions/button.md). ` +
      `A JSON manifest of all pages is at ${normalizedSiteUrl}/llms.json.`,
  ].join("\n");

  return [header, "", ...renderedSections, ""].join("\n\n");
};
