import { getAllDocPages } from "@/lib/llms/docPages";

export const dynamic = "force-static";

export function GET(): Response {
  const pages = getAllDocPages();

  const header = [
    "# mittwald Flow — Full documentation",
    "",
    "> Full-text Markdown export of the Flow design system documentation, " +
      "generated for LLMs. The React components are published as " +
      "`@mittwald/flow-react-components`. Source: https://github.com/mittwald/flow",
    "",
    "Individual pages are also available by prefixing any docs path with " +
      "`/raw/` and appending `.md`.",
  ].join("\n");

  const body = [header, ...pages.map((page) => page.toMarkdown().trim())].join(
    "\n\n---\n\n",
  );

  return new Response(`${body}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
