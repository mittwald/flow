import * as flowReact from "@mittwald/flow-react-components";
import { afterEach, expect, test } from "vitest";
import * as flowRemoteSvelte from "../index.js";
import IconSet from "./fixtures/IconSet.svelte";
import { cleanupRemote, renderRemote } from "./lib/environment.js";

/*
 * The icon set is generated from the same `icons.yaml` as React's, and shaped
 * after what `packages/components` exports: an icon is a wrapper around `Icon`
 * whose child is the raw `<svg>`. So `size` is `Icon`'s `"s" | "m" | "l"`, the
 * host applies `flow--icon…` and whatever its surroundings contribute, and the
 * `<svg>` keeps Tabler's own classes.
 *
 * The corpus proves they render what React renders — every scenario with an
 * icon in it. What this file pins is the shape a Svelte app writes against.
 */
afterEach(() => cleanupRemote());

const icons = (host: Element) => [...host.querySelectorAll("svg")];

/*
 * Pin the set against React's rather than against a count: both are generated
 * from the same `icons.yaml`, so an icon added there has to reach both — and a
 * hard-coded number would only ever report that the file grew.
 */
const iconNames = (module: object, notAnIcon: string[]) =>
  Object.keys(module)
    .filter((name) => name.startsWith("Icon") && !notAnIcon.includes(name))
    .sort();

test("the set is exported from the package, and it is React's", () => {
  expect(flowRemoteSvelte).toHaveProperty("IconInfo");
  expect(flowRemoteSvelte).toHaveProperty("IconStar");

  /* `Icon` is the generated component they wrap, `IconSetProvider` replaces
   * them, and React additionally exports the `IconProps`-adjacent `IconSet`. */
  expect(iconNames(flowRemoteSvelte, ["Icon", "IconSetProvider"])).toEqual(
    iconNames(flowReact, ["Icon", "IconSetProvider", "IconSet"]),
  );
});

test("an icon reaches the host through Icon, keeping Tabler's classes", async () => {
  const { host } = renderRemote(IconSet);

  await expect.poll(() => icons(host).length, { timeout: 5000 }).toBe(4);

  const [small] = icons(host);

  /* Flow's classes come from the host's `Icon`; Tabler's travel with the svg. */
  expect(small?.getAttribute("class")).toContain("flow--icon");
  expect(small?.getAttribute("class")).toContain("tabler-icon-info-circle");
});

/*
 * `size` is `Icon`'s prop, not a pixel count — the raw `<svg>` is always 24 and
 * the host decides how big it renders. Getting this wrong would be invisible
 * until a `size="s"` icon rendered at 24px.
 */
test("size and color are the Icon's props", async () => {
  const { host } = renderRemote(IconSet);

  await expect.poll(() => icons(host).length, { timeout: 5000 }).toBe(4);

  const [small, coloured] = icons(host);

  expect(small?.getAttribute("class")).toContain("flow--icon--size-s");
  expect(small?.getAttribute("width")).toBe("24");

  expect(coloured?.getAttribute("class")).toContain("flow--icon--danger");
});

/* Three icons in `icons.yaml` are custom SVG rather than Tabler. */
test("a custom SVG icon renders too", async () => {
  const { host } = renderRemote(IconSet);

  await expect.poll(() => icons(host).length, { timeout: 5000 }).toBe(4);

  const star = icons(host)[2];

  expect(star?.getAttribute("viewBox")).toBe("0 0 21 20");
  expect(star?.querySelectorAll("path")).toHaveLength(1);
});
