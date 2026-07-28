import type { MetadataRoute } from "next";
import { getAllDocPages } from "@/lib/llms/docPages";
import { SITE_URL, pagePath } from "@/lib/llms/siteUrls";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = getAllDocPages();

  return [
    { url: SITE_URL },
    ...pages.map((page) => ({ url: `${SITE_URL}${pagePath(page.segments)}` })),
  ];
}
