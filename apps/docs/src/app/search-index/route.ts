import { buildSearchIndex } from "@/lib/search/buildSearchIndex";

export const dynamic = "force-static";

export const GET = (): Response => Response.json(buildSearchIndex());
