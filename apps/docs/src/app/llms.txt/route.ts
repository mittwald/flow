import { generateLlmsTxt } from "@/lib/llms/generateLlmsTxt";
import type { NextRequest } from "next/server";

export const dynamic = "force-static";

export async function GET(request: NextRequest): Promise<Response> {
  const currentUrl = request.url;
  const pathname = request.nextUrl.pathname;
  const siteUrl = currentUrl.replace(pathname, "");

  const body = await generateLlmsTxt(siteUrl);

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
