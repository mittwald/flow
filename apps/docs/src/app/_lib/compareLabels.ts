import { extractTextFromPath } from "@/app/_lib/extractTextFromPath";

/**
 * Navigation and lists must agree on order, so both sort by the rendered label.
 * Path order is not the same: "action-group" sorts before "action".
 */
export const compareLabels = (a: string, b: string): number =>
  a.localeCompare(b);

export const compareGroupPaths = (a: string, b: string): number =>
  compareLabels(extractTextFromPath(a), extractTextFromPath(b));
