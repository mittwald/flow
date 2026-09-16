/*
 * Flow's icons are React components, so a Svelte app cannot use them. What it
 * can do is put a raw `<svg>` inside `Icon`: plain elements travel through the
 * remote tree like any other node, and `Icon` gives them Flow's sizing and
 * colour. These are Tabler's paths.
 */
export const iconApp = [
  "M4 4h6v6h-6z",
  "M14 4h6v6h-6z",
  "M4 14h6v6h-6z",
  "M14 14h6v6h-6z",
];
export const iconMonitoring = ["M3 12h4l3 8l4 -16l3 8h4"];
export const iconMoodSad = [
  "M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0 -18",
  "M9 10l.01 0",
  "M15 10l.01 0",
  "M9.5 15.25a3.5 3.5 0 0 1 5 0",
];
export const iconMoodEmpty = [
  "M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0 -18",
  "M9 10l.01 0",
  "M15 10l.01 0",
  "M9 15l6 0",
];
export const iconMoodHappy = [
  "M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0 -18",
  "M9 10l.01 0",
  "M15 10l.01 0",
  "M9.5 14.25a3.5 3.5 0 0 0 5 0",
];
