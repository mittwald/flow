import type { MetadataRoute } from "next";
import { getAllDocPages } from "@/lib/llms/docPages";
import { SITE_URL, pagePath } from "@/lib/llms/siteUrls";

export const dynamic = "force-static";

const COMPONENTS_SECTION = "04-components";

export default function sitemap(): MetadataRoute.Sitemap {
  // Components live on a single page (segments length 3). The per-tab pages
  // (length 4) only redirect there, so keep them out of the sitemap.
  const pages = getAllDocPages().filter(
    (page) =>
      !(page.segments[0] === COMPONENTS_SECTION && page.segments.length === 4),
  );

  return [
    { url: SITE_URL },
    ...pages.map((page) => ({ url: `${SITE_URL}${pagePath(page.segments)}` })),
  ];
}
