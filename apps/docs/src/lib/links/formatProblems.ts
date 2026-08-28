import type { LinkProblem } from "@/lib/links/checkLinks";

const describe = (problem: LinkProblem): string => {
  switch (problem.reason) {
    case "relative-link":
      return 'relative link — internal links must start with "/"';
    case "unknown-page":
      return problem.suggestions.length
        ? `unknown page — did you mean ${problem.suggestions.join(" or ")}?`
        : "unknown page";
    case "unknown-anchor":
      return problem.availableAnchors.length
        ? `unknown anchor — the page offers ${problem.availableAnchors.join(", ")}`
        : "unknown anchor — the page has no anchors";
  }
};

/**
 * Renders every problem at once. Moving a page breaks a dozen links in one go,
 * and those belong in a single CI run rather than one per fix.
 */
export const formatProblems = (problems: LinkProblem[]): string =>
  [
    `${problems.length} broken ${problems.length === 1 ? "link" : "links"}:`,
    ...problems.map(
      (problem) =>
        `  ${problem.file}:${problem.line}  ${problem.href}\n    ${describe(problem)}`,
    ),
  ].join("\n");
