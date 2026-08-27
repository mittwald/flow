import { compareLabels } from "@/app/_lib/compareLabels";
import { compareDeprecatedLast } from "@/lib/componentStatus";

/**
 * What ordering needs to know about a navigation entry or an overview tile.
 * Both sort different shapes, so both map onto this one — the order itself is
 * defined once, in `compareEntries`.
 */
export interface SortableEntry {
  /** The rendered label. */
  label: string;
  /** The path segment; a numeric prefix ("01-design") is the author's order. */
  pathSegment: string;
  /** Component display name, for the deprecated demotion. Absent for groups. */
  component?: string;
}

/** A numeric path prefix ("01-design") is the author's intended order. */
const pathPrefix = (entry: SortableEntry): number | undefined => {
  const prefix = /^(\d+)-/.exec(entry.pathSegment)?.[1];
  return prefix === undefined ? undefined : Number(prefix);
};

const comparePosition = (a: SortableEntry, b: SortableEntry): number => {
  const prefixA = pathPrefix(a);
  const prefixB = pathPrefix(b);

  return prefixA !== undefined && prefixB !== undefined
    ? prefixA - prefixB
    : compareLabels(a.label, b.label);
};

/**
 * The order of the component documentation: deprecated components last, then
 * the author's numeric prefix, then the rendered label. Navigation and the
 * component overview must agree, so both go through here.
 */
export const compareEntries = (a: SortableEntry, b: SortableEntry): number =>
  compareDeprecatedLast(a.component, b.component) || comparePosition(a, b);
