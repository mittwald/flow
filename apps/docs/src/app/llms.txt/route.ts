import { generateLlmsTxt } from "@/lib/llms/generateLlmsTxt";
import type { NextRequest } from "next/server";

export const dynamic = "force-static";

const getBaseUrl = (req: NextRequest) => {
  const proto = req.headers.get("x-forwarded-proto") ?? "http";
  const host =
    req.headers.get("x-forwarded-host") ??
    req.headers.get("host") ??
    "localhost";

  return new URL("", `${proto}://${host}`);
};

export async function GET(request: NextRequest): Promise<Response> {
  const baseUrl = getBaseUrl(request);
  const body = await generateLlmsTxt(baseUrl.toString());

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
