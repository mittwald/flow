import { generateLlmsTxt } from "@/lib/llms/generateLlmsTxt";

export const dynamic = "force-static";

export function GET(): Response {
  return new Response(generateLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
