import type { MetadataRoute } from "next";
import { IS_CANONICAL_SITE, SITE_URL } from "@/lib/llms/siteUrls";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // A preview deployment serves the same content as flow.mittwald.de under a
  // different hostname. Left indexable, it competes with the production site
  // for the same queries — so a build that is not the canonical site asks to
  // stay out of the index entirely, and offers neither sitemap nor host.
  if (!IS_CANONICAL_SITE) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
