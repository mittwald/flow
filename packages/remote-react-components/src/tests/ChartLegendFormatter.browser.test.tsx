import { testEnvironments } from "@/tests/lib/environments";
import { expect, test } from "vitest";

/*
 * `ChartLegend.formatter` crosses as a `@quilted/threads` proxy, so a remote
 * host gets a Promise back from every call. The legend awaits it, the way
 * `ChartTooltip` awaits its formatters; rendering the result synchronously put
 * `[object Promise]` into every legend item.
 */

const data = [
  { time: "0:00", Shields: 40 },
  { time: "1:00", Shields: 30 },
];

test.each(testEnvironments)(
  "ChartLegend formatter formats the legend (%s)",
  async (environment) => {
    const {
      render,
      container,
      components: { CartesianChart, Area, ChartLegend },
    } = environment;

    await render(
      <CartesianChart data={data} height="300px">
        <Area dataKey="Shields" />
        <ChartLegend formatter={(text) => `LEGEND-${text}`} />
      </CartesianChart>,
    );

    await expect
      .poll(() => container.element().textContent ?? "", {
        timeout: 10_000,
        message: 'Expected the legend to render "LEGEND-Shields".',
      })
      .toContain("LEGEND-Shields");

    expect(container.element().textContent).not.toContain("[object Promise]");
  },
);
