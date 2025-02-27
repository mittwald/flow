import type { Row, SortingFn } from "@tanstack/react-table";

export const SortingFunctions = {
  bigInt: ((rowA: Row<bigint>, rowB: Row<bigint>, columnId) => {
    const valueA = rowA.getValue(columnId);
    const valueB = rowB.getValue(columnId);

    if (valueA == null) return valueB == null ? 0 : -1;
    if (valueB == null) return 1;

    try {
      return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
    } catch (error) {
      console.warn(`Fehler beim BigInt-Vergleich: ${error}`);
      return 0;
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

      if (isNaN(dateTimeA.getTime())) throw new Error("Invalid date A");
      if (isNaN(dateTimeB.getTime())) throw new Error("Invalid date B");

      return dateTimeA.getTime() - dateTimeB.getTime();
    } catch (error) {
      console.warn(
        `Fehler beim DateTime-Vergleich, Fallback zu String-Vergleich: ${error}`,
      );
      const strA = String(valueA || "");
      const strB = String(valueB || "");
      return strA.localeCompare(strB);
    }
  }) as SortingFn<unknown>,
};
