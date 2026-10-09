import { Area, CartesianChart, XAxis } from "@/index";
import { cleanupRemote, renderRemote } from "@/tests/lib/environment";
import { afterEach, expect, test } from "vitest";
import { defineComponent, h } from "vue";

/*
 * The Vue counterpart of the React package's test of the same name.
 *
 * `tickFormatter` is host-only: `@flr-ignore-props` keeps it off the remote
 * surface of XAxis/YAxis. Without that, the generator ships it as a remote
 * *property*, and a function property crosses as a `@quilted/threads` proxy
 * whose call returns a Promise. recharts calls the formatter synchronously and
 * concatenates the result into the tick label, so every tick rendered
 * `[object Promise]` — silently, with no error anywhere.
 *
 * Remotely the prop is therefore dropped and the raw value is rendered. This
 * package inherits the generated surface, so it inherits the guarantee — and
 * the regression would look exactly the same here.
 */
afterEach(() => cleanupRemote());

const data = [
  { time: "0:00", Shields: 40 },
  { time: "1:00", Shields: 30 },
  { time: "2:00", Shields: 20 },
];

test("XAxis tickFormatter is dropped remotely, and never renders a Promise", async () => {
  const { host } = renderRemote(
    defineComponent(
      () => () =>
        h(CartesianChart, { data, height: "300px" }, () => [
          h(Area, { dataKey: "Shields" }),
          h(XAxis, {
            dataKey: "time",
            tickFormatter: (value: unknown) => `TICK-${String(value)}`,
          }),
        ]),
    ),
  );

  await expect
    .poll(() => host.textContent ?? "", {
      timeout: 10_000,
      message: 'Expected the axis to render the raw tick "1:00".',
    })
    .toContain("1:00");

  expect(host.textContent).not.toContain("[object Promise]");
  expect(host.textContent).not.toContain("TICK-");
});
