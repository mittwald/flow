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
};
