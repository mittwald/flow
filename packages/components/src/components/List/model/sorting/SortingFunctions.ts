import type { Row, SortingFn } from "@tanstack/react-table";
import invariant from "invariant";

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

  dateTime: ((rowA, rowB, columnId) => {
    const valueA = rowA.getValue(columnId);
    const valueB = rowB.getValue(columnId);

    if (valueA == null) return valueB == null ? 0 : -1;
    if (valueB == null) return 1;

    let dateTimeA: Date;
    let dateTimeB: Date;

    try {
      dateTimeA =
        valueA instanceof Date
          ? valueA
          : typeof valueA === "number"
            ? new Date(valueA)
            : new Date(String(valueA));

      dateTimeB =
        valueB instanceof Date
          ? valueB
          : typeof valueB === "number"
            ? new Date(valueB)
            : new Date(String(valueB));

      invariant(
        !isNaN(dateTimeA.getTime()) && !isNaN(dateTimeB.getTime()),
        `Invalid date values: ${valueA} and/or ${valueB}`,
      );

      return dateTimeA.getTime() - dateTimeB.getTime();
    } catch (error) {
      console.error(
        `Error in DateTime comparison, falling back to string comparison: ${error}`,
      );
    }
  }) as SortingFn<unknown>,
};
