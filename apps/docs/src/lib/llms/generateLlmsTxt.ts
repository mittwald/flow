import { MdxFileFactory } from "@/lib/mdx/MdxFileFactory";
import type { MdxFile } from "@/lib/mdx/MdxFile";
import path from "path";
import fs from "fs";

interface Section {
  contentFolder: string;
  routeSegment: string;
  heading: string;
  toPathname: (mdxFile: MdxFile) => string;
}

const contentFolder = "./src/content";
const directorySections = fs.readdirSync(contentFolder);
const sections: Section[] = directorySections.map((s) => {
  return {
    contentFolder: path.join(contentFolder, s),
    routeSegment: s,
    heading: s
      .replaceAll(/(\d+)-/g, "")
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
    .sort((a, b) => a.filename.localeCompare(b.filename))
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
  ].join("\n");

  return [header, "", ...renderedSections, ""].join("\n\n");
};
