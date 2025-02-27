import type { SortingFn } from "@tanstack/react-table";

export const SortingFunctions = {
  bigInt: ((rowA, rowB, columnId) => {
    try {
      const valueA = rowA.getValue(columnId);
      const valueB = rowB.getValue(columnId);

      if (valueA == null) return valueB == null ? 0 : -1;
      if (valueB == null) return 1;

      const strValueA = String(valueA).replace(/[^\d-]/g, "");
      const strValueB = String(valueB).replace(/[^\d-]/g, "");

      const bigIntA = BigInt(strValueA || "0");
      const bigIntB = BigInt(strValueB || "0");

      if (bigIntA < bigIntB) return -1;
      if (bigIntA > bigIntB) return 1;
      return 0;
    } catch (error) {
      console.warn(
        `Fehler beim BigInt-Vergleich, Fallback zu String-Vergleich: ${error}`,
      );
      const valueA = String(rowA.getValue(columnId) || "");
      const valueB = String(rowB.getValue(columnId) || "");
      return valueA.localeCompare(valueB);
    }
  }) as SortingFn<unknown>,

  alphanumeric: "alphanumeric" as const,

  date: ((rowA, rowB, columnId) => {
    const valueA = rowA.getValue(columnId);
    const valueB = rowB.getValue(columnId);

    if (valueA == null) return valueB == null ? 0 : -1;
    if (valueB == null) return 1;

    const dateA = valueA instanceof Date ? valueA : new Date(String(valueA));
    const dateB = valueB instanceof Date ? valueB : new Date(String(valueB));

    return dateA.getTime() - dateB.getTime();
  }) as SortingFn<unknown>,
};

export const bigIntSortingFn = SortingFunctions.bigInt;
