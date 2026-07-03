import { generateLlmsTxt } from "@/lib/llms/generateLlmsTxt";
import type { NextRequest } from "next/server";

export const dynamic = "force-static";

export async function GET(request: NextRequest): Promise<Response> {
  const body = await generateLlmsTxt(
    process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin,
  );

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
