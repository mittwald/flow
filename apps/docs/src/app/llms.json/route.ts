import { generateLlmsJson } from "@/lib/llms/generateLlmsJson";

export const dynamic = "force-static";

export function GET(): Response {
  return Response.json(generateLlmsJson());
}
