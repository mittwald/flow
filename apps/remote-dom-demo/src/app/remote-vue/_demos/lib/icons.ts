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

/*
 * Tabler's *filled* variants are one path each, drawn rather than stroked —
 * the eyes and the mouth are holes in it. The `rating` demo shows them when a
 * segment is filled, the way the React page does.
 */
const tablerFilledIcon = (path: string): VNode =>
  h(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "currentColor",
      stroke: "none",
      xmlns: "http://www.w3.org/2000/svg",
    },
    h("path", { d: path }),
  );

export const iconMoodSadFilled = () =>
  tablerFilledIcon(
    "M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-5 9.86a4.5 4.5 0 0 0 -3.214 1.35a1 1 0 1 0 1.428 1.4a2.5 2.5 0 0 1 3.572 0a1 1 0 0 0 1.428 -1.4a4.5 4.5 0 0 0 -3.214 -1.35zm-2.99 -4.2l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm6 0l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007z",
  );

export const iconMoodEmptyFilled = () =>
  tablerFilledIcon(
    "M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-2 10.66h-6l-.117 .007a1 1 0 0 0 0 1.986l.117 .007h6l.117 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-5.99 -5l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm6 0l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007z",
  );

export const iconMoodHappyFilled = () =>
  tablerFilledIcon(
    "M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-2 9.66h-6a1 1 0 0 0 -1 1v.05a3.975 3.975 0 0 0 3.777 3.97l.227 .005a4.026 4.026 0 0 0 3.99 -3.79l.006 -.206a1 1 0 0 0 -1 -1.029zm-5.99 -5l-.127 .007a1 1 0 0 0 .117 1.993l.127 -.007a1 1 0 0 0 -.117 -1.993zm6 0l-.127 .007a1 1 0 0 0 .117 1.993l.127 -.007a1 1 0 0 0 -.117 -1.993z",
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
