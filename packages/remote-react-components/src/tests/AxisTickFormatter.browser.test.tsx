import { testEnvironments } from "@/tests/lib/environments";
import { expect, test } from "vitest";

/*
 * `tickFormatter` is host-only: `@flr-ignore-props` keeps it off the remote
 * surface of XAxis/YAxis.
 *
 * Without that, the generator ships it as a remote *property*, and a function
 * property crosses as a `@quilted/threads` proxy whose call returns a Promise.
 * recharts calls the formatter synchronously and concatenates the result into
 * the tick label (`"".concat(tickFormatter(value, i))` in CartesianAxis), so
 * every tick rendered `[object Promise]` — silently, with no error anywhere.
 *
 * Local therefore formats, Remote falls back to the raw value, and neither
 * renders a Promise. The `[object Promise]` assertion is the regression guard;
 * the per-environment expectation is what documents the intended difference.
 */

const data = [
  { time: "0:00", Shields: 40 },
  { time: "1:00", Shields: 30 },
  { time: "2:00", Shields: 20 },
];

test.each(testEnvironments)(
  "XAxis tickFormatter formats locally and is dropped remotely (%s)",
  async (environment) => {
    const {
      render,
      container,
      components: { CartesianChart, Area, XAxis },
    } = environment;

    await render(
      <CartesianChart data={data} height="300px">
        <Area dataKey="Shields" />
        <XAxis dataKey="time" tickFormatter={(v) => `TICK-${String(v)}`} />
      </CartesianChart>,
    );

    const expectedTick = String(environment) === "Local" ? "TICK-1:00" : "1:00";

    await expect
      .poll(() => container.element().textContent ?? "", {
        timeout: 10_000,
        message: `Expected the axis to render "${expectedTick}".`,
      })
      .toContain(expectedTick);

    expect(container.element().textContent).not.toContain("[object Promise]");
  },
);
