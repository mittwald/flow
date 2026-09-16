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
export const iconCircleCheck = [
  "M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0 -18",
  "M9 12l2 2l4 -4",
];
export const iconSearch = [
  "M10 3a7 7 0 1 0 0 14a7 7 0 0 0 0 -14",
  "M21 21l-6 -6",
];
export const iconUpload = [
  "M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2",
  "M7 9l5 -5l5 5",
  "M12 4l0 12",
];
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
