import { generateLlmsTxt } from "@/lib/llms/generateLlmsTxt";

export const dynamic = "force-static";

export async function GET(): Promise<Response> {
  const body = await generateLlmsTxt();

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
