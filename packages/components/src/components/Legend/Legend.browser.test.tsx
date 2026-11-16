import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { Legend, LegendItem } from "@/components/Legend";
import { DeprecationWarningProvider } from "@/components/DeprecationWarningProvider";
import legendItemStyles from "@/components/Legend/components/LegendItem/LegendItem.module.scss";

const colorSquare = () => {
  const square = document.querySelector<HTMLElement>(
    `.${legendItemStyles.colorSquare}`,
  );
  if (!square) {
    throw new Error("No color square rendered");
  }
  return square;
};

test.each([
  ["sea-green", "indigo"],
  ["palatinate-blue", "amber"],
  ["lime", "red"],
] as const)(
  "the deprecated color '%s' renders as '%s' and warns",
  async (color, replacement) => {
    const onWarning = vi.fn();

    await render(
      <DeprecationWarningProvider onWarning={onWarning}>
        <Legend>
          <LegendItem color={color}>Webspace</LegendItem>
        </Legend>
      </DeprecationWarningProvider>,
    );

    expect(colorSquare().style.backgroundColor).toBe(
      `var(--categorical--color--${replacement})`,
    );
    expect(onWarning).toHaveBeenCalledWith(
      `The color '${color}' is deprecated and will be removed in a future release. Use '${replacement}' instead.`,
    );
  },
);

test.each(["violet", "green", "#ff0000"])(
  "the color '%s' does not warn",
  async (color) => {
    const onWarning = vi.fn();

    await render(
      <DeprecationWarningProvider onWarning={onWarning}>
        <Legend>
          <LegendItem color={color}>Webspace</LegendItem>
        </Legend>
      </DeprecationWarningProvider>,
    );

    expect(colorSquare()).toBeTruthy();
    expect(onWarning).not.toHaveBeenCalled();
  },
);
