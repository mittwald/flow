import { h, type VNode } from "vue";

/*
 * Icons that are *not* in Flow's set. Flow's own ship as Vue components now
 * (`IconSearch`, `IconApp`, …), but the React demos also reach for Tabler
 * directly, and a raw `<svg>` inside `Icon` is how any extension does that:
 * plain elements travel through the remote tree like any other node, and `Icon`
 * gives them Flow's sizing and colour. These are Tabler's paths, drawn by hand.
 */
const tablerIcon = (...paths: string[]): VNode =>
  h(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "2",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      xmlns: "http://www.w3.org/2000/svg",
    },
    paths.map((d) => h("path", { d })),
  );

export const iconApp = () =>
  tablerIcon(
    "M4 4h6v6h-6z",
    "M14 4h6v6h-6z",
    "M4 14h6v6h-6z",
    "M14 14h6v6h-6z",
  );

export const iconMoodSad = () =>
  tablerIcon(
    "M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0 -18",
    "M9 10l.01 0",
    "M15 10l.01 0",
    "M9.5 15.25a3.5 3.5 0 0 1 5 0",
  );

export const iconMoodEmpty = () =>
  tablerIcon(
    "M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0 -18",
    "M9 10l.01 0",
    "M15 10l.01 0",
    "M9 15l6 0",
  );

export const iconMoodHappy = () =>
  tablerIcon(
    "M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0 -18",
    "M9 10l.01 0",
    "M15 10l.01 0",
    "M9.5 14.25a3.5 3.5 0 0 0 5 0",
  );

/** A plain SVG that is not an icon set's — the `svg` demo renders it as-is. */
export const plainSvg = () =>
  h(
    "svg",
    { viewBox: "0 0 200 200", xmlns: "http://www.w3.org/2000/svg" },
    h("g", null, [
      h("circle", { cx: "100", cy: "100", r: "100", fill: "currentColor" }),
    ]),
  );
