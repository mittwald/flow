import { afterEach, describe, expect, it, vi } from "vitest";

// `SITE_URL` is read once at module load, so each case needs a fresh module
// graph under its own environment.
const loadRobots = async (siteUrl?: string) => {
  vi.resetModules();
  if (siteUrl === undefined) {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", undefined);
  } else {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", siteUrl);
  }
  const { default: robots } = await import("./robots");
  return robots();
};

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("robots", () => {
  it("lets the production site be indexed", async () => {
    const result = await loadRobots();

    expect(result.rules).toEqual([{ userAgent: "*", allow: "/" }]);
    expect(result.sitemap).toBe("https://flow.mittwald.de/sitemap.xml");
    expect(result.host).toBe("https://flow.mittwald.de");
  });

  it("ignores a trailing slash on the configured site URL", async () => {
    const result = await loadRobots("https://flow.mittwald.de/");

    expect(result.rules).toEqual([{ userAgent: "*", allow: "/" }]);
  });

  it.each([
    "https://next.docs.review.flow-components.de",
    "https://pr-1234.docs.review.flow-components.de",
  ])("keeps the preview deployment %s out of the index", async (siteUrl) => {
    const result = await loadRobots(siteUrl);

    expect(result.rules).toEqual([{ userAgent: "*", disallow: "/" }]);
    expect(result.sitemap).toBeUndefined();
    expect(result.host).toBeUndefined();
  });
});
