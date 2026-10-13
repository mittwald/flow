import type { ComponentType, ReactNode } from "react";
import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import {
  CartesianChart,
  type CartesianChartEmptyViewProps,
} from "@/components/CartesianChart";
import { Bar } from "@/components/CartesianChart/components/Bar";
import { XAxis } from "@/components/CartesianChart/components/XAxis";
import { DeprecationWarningProvider } from "@/components/DeprecationWarningProvider";

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

const emptyViewDeprecation =
  "Passing a component to the 'emptyView' prop is deprecated and will be removed in a future release. Use 'emptyView={<Element />}' instead.";

const renderEmptyChart = async (emptyView: ReactNode) => {
  const onWarning = vi.fn();

  await render(
    <DeprecationWarningProvider onWarning={onWarning}>
      <CartesianChart height="300px" data={[]} emptyView={emptyView}>
        <XAxis dataKey="name" />
      </CartesianChart>
    </DeprecationWarningProvider>,
  );

  return onWarning;
};

test("a string emptyView renders and does not warn", async () => {
  const onWarning = await renderEmptyChart("No data available");

  await expect.element(page.getByText("No data available")).toBeVisible();
  expect(onWarning).not.toHaveBeenCalled();
});

test("the deprecated component emptyView still renders with the data and warns", async () => {
  const EmptyView: ComponentType<CartesianChartEmptyViewProps> = ({ data }) =>
    `No data available (${data?.length})`;

  const onWarning = await renderEmptyChart(EmptyView as unknown as ReactNode);

  await expect.element(page.getByText("No data available (0)")).toBeVisible();
  expect(onWarning).toHaveBeenCalledWith(emptyViewDeprecation);
});
