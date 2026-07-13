import { getAllDocPages } from "@/lib/llms/docPages";
import { SITE_URL, pagePath, rawMarkdownPath } from "@/lib/llms/siteUrls";

export const dynamic = "force-static";

export function GET(): Response {
  const pages = getAllDocPages().map((page) => ({
    title: page.title,
    ...(page.description ? { description: page.description } : {}),
    url: `${SITE_URL}${pagePath(page.segments)}`,
    markdown: `${SITE_URL}${rawMarkdownPath(page.segments)}`,
  }));

  return Response.json({
    name: "mittwald Flow",
    description:
      "Design system of mittwald: accessible, brand-aligned React components, " +
      "design tokens and patterns. Documentation is written in German.",
    package: "@mittwald/flow-react-components",
    repository: "https://github.com/mittwald/flow",
    llmsTxt: `${SITE_URL}/llms.txt`,
    llmsFullTxt: `${SITE_URL}/llms-full.txt`,
    pageCount: pages.length,
    pages,
  });
}
