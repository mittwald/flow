import { compareLabels } from "@/app/_lib/compareLabels";
import { compareDeprecatedLast } from "@/lib/componentStatus";
import { byContentOrder } from "@/lib/content/contentOrder";

/**
 * What ordering needs to know about a navigation entry or an overview tile.
 * Both sort different shapes, so both map onto this one — the order itself is
 * defined once, in `compareEntries`.
 */
export interface SortableEntry {
  /** The rendered label. */
  label: string;
  /** The pathname, looked up in the authored order of the documentation. */
  path: string;
  /** Component display name, for the deprecated demotion. Absent for groups. */
  component?: string;
}

const comparePosition = (a: SortableEntry, b: SortableEntry): number =>
  byContentOrder(a.path, b.path) || compareLabels(a.label, b.label);

/**
 * The order of the component documentation: deprecated components last, then
 * the authored order from `CONTENT_ORDER`, then the rendered label. Navigation
 * and the component overview must agree, so both go through here.
 */
export const compareEntries = (a: SortableEntry, b: SortableEntry): number =>
  compareDeprecatedLast(a.component, b.component) || comparePosition(a, b);
