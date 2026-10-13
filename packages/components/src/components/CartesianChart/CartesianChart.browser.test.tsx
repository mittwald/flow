import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { CartesianChart } from "@/components/CartesianChart";
import { Bar } from "@/components/CartesianChart/components/Bar";
import { XAxis } from "@/components/CartesianChart/components/XAxis";
import { YAxis } from "@/components/CartesianChart/components/YAxis";

const data = [
  { name: "Stat 1", first: 40, second: 24 },
  { name: "Stat 2", first: 30, second: 13 },
];

const stackedChart = (
  <CartesianChart height="300px" data={data}>
    <Bar dataKey="first" stackId="stack" />
    <Bar dataKey="second" stackId="stack" />
    <XAxis dataKey="name" />
  </CartesianChart>
);

test("does not share stack clip paths between charts", async () => {
  const screen = await render(
    <>
      {stackedChart}
      {stackedChart}
    </>,
  );

  const [first = new Set(), second = new Set()] = [
    ...screen.container.querySelectorAll("svg"),
  ].map(
    (svg) =>
      new Set(
        [...svg.querySelectorAll("clipPath[id*=stack]")].map(
          (clipPath) => clipPath.id,
        ),
      ),
  );

  expect(first.size).toBeGreaterThan(0);
  expect([...first].filter((id) => second.has(id))).toStrictEqual([]);
});

const categoryData = [
  { name: "Webshop Produktion", value: 68 },
  { name: "Webshop Staging", value: 42 },
  { name: "Firmenblog", value: 21 },
];

const categoryChart = (
  <CartesianChart height="300px" layout="vertical" data={categoryData}>
    <Bar dataKey="value" />
    <XAxis />
    <YAxis dataKey="name" />
  </CartesianChart>
);

/**
 * The left edge of the widest y-axis tick label, in the SVG's own user units —
 * negative when the label sticks out of the chart. `getBBox` is immune to CSS
 * zoom and transforms, so this is the geometry the chart lays out in. `NaN`
 * until every label is rendered, so a poll cannot pass on an empty axis.
 */
const leftmostTickLabelEdge = (container: HTMLElement) => {
  const labels = container.querySelectorAll<SVGTextElement>(
    ".recharts-yAxis-tick-labels .recharts-cartesian-axis-tick-value",
  );
  return labels.length === categoryData.length
    ? Math.min(...[...labels].map((label) => label.getBBox().x))
    : Number.NaN;
};

test("sizes a category y-axis to its longest label under CSS zoom", async () => {
  const screen = await render(
    <div style={{ zoom: 0.85, width: "600px" }}>{categoryChart}</div>,
  );

  await expect
    .poll(() => leftmostTickLabelEdge(screen.container))
    .toBeGreaterThanOrEqual(0);
});

test("resizes a category y-axis when web fonts finish loading", async () => {
  const screen = await render(categoryChart);
  await expect
    .poll(() => leftmostTickLabelEdge(screen.container))
    .toBeGreaterThanOrEqual(0);

  // Stands in for a web font that replaces a narrower fallback after mount.
  const widerFont = document.createElement("style");
  widerFont.textContent =
    ".recharts-cartesian-axis-tick-value { letter-spacing: 4px; }";
  document.head.append(widerFont);
  document.fonts.dispatchEvent(new Event("loadingdone"));

  try {
    await expect
      .poll(() => leftmostTickLabelEdge(screen.container))
      .toBeGreaterThanOrEqual(0);
  } finally {
    widerFont.remove();
  }
});

test("formats the labels of a category y-axis that sizes itself", async () => {
  const screen = await render(
    <CartesianChart height="300px" layout="vertical" data={categoryData}>
      <Bar dataKey="value" />
      <XAxis />
      <YAxis
        dataKey="name"
        unit=" (Projekt)"
        tickFormatter={(name, index) => `${index + 1}. ${name}`}
      />
    </CartesianChart>,
  );

  await expect
    .poll(() =>
      [
        ...screen.container.querySelectorAll(
          ".recharts-yAxis-tick-labels .recharts-cartesian-axis-tick-value",
        ),
      ].map((label) => label.textContent),
    )
    .toStrictEqual([
      "1. Webshop Produktion (Projekt)",
      "2. Webshop Staging (Projekt)",
      "3. Firmenblog (Projekt)",
    ]);
  await expect
    .poll(() => leftmostTickLabelEdge(screen.container))
    .toBeGreaterThanOrEqual(0);
});
