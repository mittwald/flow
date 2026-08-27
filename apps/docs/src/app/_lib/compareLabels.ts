/**
 * Order by the rendered label, not by path: "action-group" would sort before
 * "action". Composed into `compareEntries`, which is what callers use.
 */
export const compareLabels = (a: string, b: string): number =>
  a.localeCompare(b);
