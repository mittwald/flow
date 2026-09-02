import type { FoundLink } from "@/lib/links/extractLinks";

/** Every routable pathname of the site, mapped to the fragments it offers. */
export type PageInventory = Map<string, Set<string>>;

export type LinkProblemReason =
  "relative-link" | "unknown-page" | "unknown-anchor";

export interface LinkProblem extends FoundLink {
  reason: LinkProblemReason;
  /** Pages that plausibly replace an unknown one, best guess first. */
  suggestions: string[];
  /** Fragments the target page actually offers, for `unknown-anchor`. */
  availableAnchors: string[];
}

/** Links the check has nothing to say about — external targets are class 4. */
const IGNORED_PROTOCOL = /^(?:https?:|mailto:|tel:)/;

const SUGGESTION_THRESHOLD = 0.5;
const MAX_SUGGESTIONS = 3;

const lastSegment = (pathname: string): string =>
  pathname.split("/").filter(Boolean).at(-1) ?? "";

const tokens = (pathname: string): Set<string> =>
  new Set(pathname.split(/[/-]/).filter(Boolean));

/** Share of tokens two pathnames have in common. */
const overlap = (a: string, b: string): number => {
  const [left, right] = [tokens(a), tokens(b)];
  const shared = [...left].filter((token) => right.has(token)).length;
  const union = new Set([...left, ...right]).size;

  return union === 0 ? 0 : shared / union;
};

/**
 * Ranks existing pages against a target that does not exist.
 *
 * A page that kept its last segment wins outright, and suppresses the weaker
 * candidates: renaming a directory while keeping the page name is the move that
 * breaks links here, so the last segment is exactly what survived. Only when
 * nothing matches by name does token overlap guess at a renamed page.
 */
const suggestPages = (href: string, inventory: PageInventory): string[] => {
  const pathnames = [...inventory.keys()];

  const sameName = pathnames.filter(
    (pathname) => lastSegment(pathname) === lastSegment(href),
  );
  if (sameName.length) {
    return sameName.slice(0, MAX_SUGGESTIONS);
  }

  return pathnames
    .map((pathname) => ({ pathname, score: overlap(pathname, href) }))
    .filter(({ score }) => score >= SUGGESTION_THRESHOLD)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_SUGGESTIONS)
    .map(({ pathname }) => pathname);
};

const normalizePathname = (pathname: string): string =>
  pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;

const problem = (
  link: FoundLink,
  reason: LinkProblemReason,
  extra: Partial<Pick<LinkProblem, "suggestions" | "availableAnchors">> = {},
): LinkProblem => ({
  ...link,
  reason,
  suggestions: extra.suggestions ?? [],
  availableAnchors: extra.availableAnchors ?? [],
});

const checkFragment = (
  link: FoundLink,
  fragment: string,
  anchors: Set<string>,
): LinkProblem[] =>
  anchors.has(fragment)
    ? []
    : [
        problem(link, "unknown-anchor", {
          availableAnchors: [...anchors].sort(),
        }),
      ];

const checkLink = (
  link: FoundLink,
  inventory: PageInventory,
): LinkProblem[] => {
  const { href } = link;

  if (IGNORED_PROTOCOL.test(href)) {
    return [];
  }

  if (href.startsWith("#")) {
    const fragment = href.slice(1);
    const anchors = link.page ? inventory.get(link.page) : undefined;

    // `href="#"` is the standard placeholder in code examples, and a fragment
    // in a file that renders no page of its own cannot be resolved.
    if (!fragment || !anchors) {
      return [];
    }

    return checkFragment(link, fragment, anchors);
  }

  if (!href.startsWith("/")) {
    return [problem(link, "relative-link")];
  }

  const [target = "", fragment] = href.split("#");
  const pathname = normalizePathname(target.split("?")[0] ?? "");
  const anchors = inventory.get(pathname);

  if (!anchors) {
    return [
      problem(link, "unknown-page", {
        suggestions: suggestPages(pathname, inventory),
      }),
    ];
  }

  return fragment ? checkFragment(link, fragment, anchors) : [];
};

/**
 * Validates internal links against the pages that exist. Pure: hand it links
 * and an inventory, it tells you which links are broken.
 */
export const checkLinks = (
  links: FoundLink[],
  inventory: PageInventory,
): LinkProblem[] => links.flatMap((link) => checkLink(link, inventory));
