import type { MetadataRoute } from "next";
import { getAllDocPages } from "@/lib/llms/docPages";
import { SITE_URL, pagePath } from "@/lib/llms/siteUrls";

export const dynamic = "force-static";

const COMPONENTS_SECTION = "04-components";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = getAllDocPages().filter(
    (page) =>
      !(page.segments[0] === COMPONENTS_SECTION && page.segments.length === 3),
  );

  return [
    { url: SITE_URL },
    ...pages.map((page) => ({ url: `${SITE_URL}${pagePath(page.segments)}` })),
  ];
}
