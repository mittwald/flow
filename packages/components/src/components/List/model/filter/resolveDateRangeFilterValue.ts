import { resolveListDateRange } from "@mittwald/flow-components-base";
import type { DateRangeFilterValue } from "@/components/List/model/filter/types";

/**
 * Resolves the value of a date range filter to the instants it spans, for
 * filtering on the server side. Both bounds are inclusive: a date covers its
 * whole day and a date with time its whole minute, in the user's local time
 * zone. A missing side has no bound.
 */
export const resolveDateRangeFilterValue = (
  range: DateRangeFilterValue,
): { start?: Date; end?: Date } => resolveListDateRange(range);
