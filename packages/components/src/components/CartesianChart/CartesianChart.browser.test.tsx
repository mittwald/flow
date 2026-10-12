import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { CartesianChart } from "@/components/CartesianChart";
import { Bar } from "@/components/CartesianChart/components/Bar";
import { XAxis } from "@/components/CartesianChart/components/XAxis";

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
