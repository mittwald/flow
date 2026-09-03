import { getAllDocPages } from "@/lib/llms/docPages";

export const dynamic = "force-static";

const pages = getAllDocPages();

const keyOf = (segments: string[]): string => segments.join("/");

const pagesByKey = new Map(pages.map((page) => [keyOf(page.segments), page]));

export const generateStaticParams = (): { path: string[] }[] =>
  pages.map((page) => {
    const segments = [...page.segments];
    segments[segments.length - 1] = `${segments[segments.length - 1]}.md`;
    return { path: segments };
  });

export async function GET(
  _request: Request,
  context: { params: Promise<{ path: string[] }> },
): Promise<Response> {
  const { path } = await context.params;
  const segments = [...path];
  const last = segments[segments.length - 1];
  if (!last?.endsWith(".md")) {
    return new Response("Not found", { status: 404 });
  }
  segments[segments.length - 1] = last.slice(0, -".md".length);

  const page = pagesByKey.get(keyOf(segments));
  if (!page) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(page.toMarkdown(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
