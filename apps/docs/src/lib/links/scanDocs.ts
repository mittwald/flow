import jetpack from "fs-jetpack";
import * as path from "path";
import { extractAnchors } from "@/lib/mdx/anchors";
import type { PageInventory } from "@/lib/links/checkLinks";
import type { FoundLink } from "@/lib/links/extractLinks";
import { extractMdxLinks, extractSourceLinks } from "@/lib/links/extractLinks";

const contentDir = "src/content";
/** Directories holding the app's own code — scanned for hardcoded links. */
const sourceDirs = ["src/app", "src/lib"];

const componentsSection = "04-components";

/**
 * Routes kept as `redirect()` pages so links written before the component tabs
 * were merged into one page keep working, fragments included.
 */
const legacyComponentTabs = ["overview", "guidelines", "develop"];

const pathnameOf = (dir: string): string => (dir === "." ? "/" : `/${dir}`);

const isDynamicRoute = (dir: string): boolean =>
  dir.split("/").some((segment) => segment.startsWith("["));

/**
 * Every pathname the site serves, with the fragments each page offers.
 *
 * Content directories mirror the route structure one to one, so a single rule
 * covers all four sections. `src/app` adds the routes that have no MDX behind
 * them (the start page, the component index) — derived rather than listed by
 * hand so a new static route does not silently fail the check.
 */
export const buildPageInventory = (): PageInventory => {
  const inventory: PageInventory = new Map();

  for (const file of jetpack.find(contentDir, { matching: "**/index.mdx" })) {
    const dir = path.dirname(path.relative(contentDir, file));
    const anchors = new Set(
      extractAnchors(jetpack.read(file) ?? "").map((anchor) => anchor.slug),
    );

    inventory.set(pathnameOf(dir), anchors);

    if (dir.startsWith(`${componentsSection}/`)) {
      for (const tab of legacyComponentTabs) {
        inventory.set(`${pathnameOf(dir)}/${tab}`, anchors);
      }
    }
  }

  for (const dir of sourceDirs) {
    for (const file of jetpack.find(dir, { matching: "**/page.tsx" })) {
      const routeDir = path.dirname(path.relative(dir, file));

      if (isDynamicRoute(routeDir)) {
        continue;
      }
      const pathname = pathnameOf(routeDir);

      if (!inventory.has(pathname)) {
        inventory.set(pathname, new Set());
      }
    }
  }

  return inventory;
};

/**
 * Every link written in the documentation: the MDX content plus the hardcoded
 * links in the app's own code (navigation, start page). Example files under
 * `src/content` are code samples, not navigation, and stay out — as do test
 * files, whose fixtures link to pages that deliberately do not exist.
 */
export const collectDocLinks = (): FoundLink[] => [
  ...jetpack
    .find(contentDir, { matching: "**/index.mdx" })
    .flatMap((file) =>
      extractMdxLinks(
        jetpack.read(file) ?? "",
        file,
        pathnameOf(path.dirname(path.relative(contentDir, file))),
      ),
    ),
  ...sourceDirs.flatMap((dir) =>
    jetpack
      .find(dir, {
        matching: ["**/*.ts", "**/*.tsx", "!**/*.test.ts", "!**/*.test.tsx"],
      })
      .flatMap((file) => extractSourceLinks(jetpack.read(file) ?? "", file)),
  ),
];
