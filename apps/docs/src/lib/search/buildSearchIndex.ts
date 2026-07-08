import jetpack from "fs-jetpack";
import matter from "gray-matter";
import * as path from "path";
import { extractTextFromPath } from "@/app/_lib/extractTextFromPath";
import { extractHeadings, mdxToPlainText } from "@/lib/search/plainText";
import type { SearchHeading, SearchIndexEntry } from "@/lib/search/types";

const COMPONENTS_SEGMENT = "04-components";

const TAB_LABELS: Record<string, string> = {
  overview: "Overview",
  guidelines: "Guidelines",
  develop: "Develop",
};

interface ParsedFile {
  segments: string[];
  name: string;
  data: Record<string, string>;
  content: string;
}

let cache: SearchIndexEntry[] | null = null;

const toHeadings = (content: string): SearchHeading[] =>
  extractHeadings(content)
    .filter((heading) => heading.level <= 2)
    .map((heading) => ({ text: heading.text, slug: heading.slug }));

export const buildSearchIndex = (
  contentDir = "src/content",
): SearchIndexEntry[] => {
  if (cache && process.env.NODE_ENV === "production") {
    return cache;
  }

  const parsed: ParsedFile[] = jetpack
    .find(contentDir, { matching: "**/*.mdx" })
    .map((file) => {
      const relativeDir = path.dirname(path.relative(contentDir, file));
      const segments = relativeDir === "." ? [] : relativeDir.split(path.sep);
      const { data, content } = matter(jetpack.read(file) ?? "");
      return {
        segments,
        name: path.basename(file, ".mdx"),
        data: data as Record<string, string>,
        content,
      };
    });

  const componentMeta = new Map<
    string,
    { title: string; description?: string }
  >();
  for (const file of parsed) {
    const [top, group, component] = file.segments;
    if (
      top === COMPONENTS_SEGMENT &&
      file.segments.length === 3 &&
      file.name === "index" &&
      group &&
      component
    ) {
      componentMeta.set(`${group}/${component}`, {
        title:
          file.data.component ??
          file.data.title ??
          extractTextFromPath(component),
        description: file.data.description,
      });
    }
  }

  const entries: SearchIndexEntry[] = [];

  for (const file of parsed) {
    const top = file.segments[0];
    if (!top) {
      continue;
    }
    const section = extractTextFromPath(top);

    if (top === COMPONENTS_SEGMENT) {
      const [, group, component] = file.segments;
      if (file.segments.length !== 3 || !group || !component) {
        continue;
      }
      const meta = componentMeta.get(`${group}/${component}`);
      const title = meta?.title ?? extractTextFromPath(component);
      const breadcrumb = [section, extractTextFromPath(group)];
      const basePath = `/${COMPONENTS_SEGMENT}/${group}/${component}`;

      if (file.name === "index") {
        const hasOverview = parsed.some(
          (other) =>
            other.segments[0] === COMPONENTS_SEGMENT &&
            other.segments[1] === group &&
            other.segments[2] === component &&
            other.name === "overview",
        );
        if (hasOverview) {
          continue;
        }
        const url = `${basePath}/overview`;
        entries.push({
          id: url,
          url,
          title,
          section,
          breadcrumb,
          description: meta?.description,
          headings: [],
          content: meta?.description ?? "",
        });
        continue;
      }

      const tab = TAB_LABELS[file.name];
      if (!tab) {
        continue;
      }
      const url = `${basePath}/${file.name}`;
      const isOverview = file.name === "overview";
      const description = isOverview ? meta?.description : undefined;
      const body = mdxToPlainText(file.content);

      entries.push({
        id: url,
        url,
        title,
        section,
        breadcrumb,
        tab,
        description,
        headings: toHeadings(file.content),
        content: description ? `${description} ${body}`.trim() : body,
      });
      continue;
    }

    if (file.name !== "index") {
      continue;
    }
    const url = `/${file.segments.join("/")}`;
    const title =
      file.data.title ??
      file.data.component ??
      extractTextFromPath(file.segments[file.segments.length - 1] ?? top);
    const breadcrumb = file.segments.slice(0, -1).map(extractTextFromPath);

    entries.push({
      id: url,
      url,
      title,
      section,
      breadcrumb: breadcrumb.length > 0 ? breadcrumb : [section],
      description: file.data.description,
      headings: toHeadings(file.content),
      content: mdxToPlainText(file.content),
    });
  }

  cache = entries;
  return entries;
};
