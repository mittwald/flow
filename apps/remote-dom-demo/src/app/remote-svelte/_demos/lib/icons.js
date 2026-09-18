/*
 * The mood faces the `rating` demo uses. Flow's icon set does not ship them —
 * the React page imports them straight from `@tabler/icons-react` — so this is
 * what a Svelte app does for an icon Flow does not have: put a raw `<svg>`
 * inside `Icon`. Plain elements travel through the remote tree like any other
 * node, and `Icon` gives them Flow's sizing and colour.
 *
 * Everything Flow *does* ship is imported from the generated Svelte icon set
 * instead — see `Svg.svelte`, `ContextMenu.svelte`, `Chart.svelte`,
 * `Files.svelte` and `Tunnel.svelte`.
 */
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
