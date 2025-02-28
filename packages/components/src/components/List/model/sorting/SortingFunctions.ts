import type { Row, SortingFn } from "@tanstack/react-table";
import invariant from "invariant";
import { DateTime } from "luxon";

export const SortingFunctions = {
  bigInt: ((rowA: Row<bigint>, rowB: Row<bigint>, columnId) => {
    const valueA = rowA.getValue(columnId);
    const valueB = rowB.getValue(columnId);

    if (valueA == null) return valueB == null ? 0 : -1;
    if (valueB == null) return 1;

    try {
      invariant(
        typeof valueA === "bigint" && typeof valueB === "bigint",
        `Expected BigInt values, got ${typeof valueA} and ${typeof valueB}`,
      );

      return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
    } catch (error) {
      console.error(`Error in BigInt comparison: ${error}`);
    }
  }) as SortingFn<unknown>,

  alphanumeric: "alphanumeric" as const,

  dateTime: ((rowA: Row<unknown>, rowB: Row<unknown>, columnId) => {
    const valueA = rowA.getValue(columnId);
    const valueB = rowB.getValue(columnId);

    if (valueA == null) return valueB == null ? 0 : -1;
    if (valueB == null) return 1;

    let dtA: DateTime | null = null;
    let dtB: DateTime | null = null;

    if (valueA instanceof DateTime) {
      dtA = valueA;
    } else if (typeof valueA === "string") {
      dtA = DateTime.fromISO(valueA);
    }

    if (valueB instanceof DateTime) {
      dtB = valueB;
    } else if (typeof valueB === "string") {
      dtB = DateTime.fromISO(valueB);
    }

    if (dtA?.isValid && dtB?.isValid) {
      return dtA.toMillis() - dtB.toMillis();
    } else if (dtA?.isValid) {
      return -1;
    } else if (dtB?.isValid) {
      return 1;
    } else {
      console.warn("Invalid DateTime values for sorting.");
      return 0;
    }
  }) as SortingFn<unknown>,
};
