import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { AccentBox } from "@/components/AccentBox";
import { DeprecationWarningProvider } from "@/components/DeprecationWarningProvider";

const renderedAccentBox = (): Element => {
  const element = document.querySelector(".accent-box-under-test");
  if (!element) {
    throw new Error("AccentBox not rendered");
  }
  return element;
};

test.each([
  ["gradient", "gradient-navy"],
  ["green", "sage"],
] as const)(
  "the deprecated backgroundColor '%s' renders as '%s' and warns",
  async (backgroundColor, replacement) => {
    const onWarning = vi.fn();

    await render(
      <DeprecationWarningProvider onWarning={onWarning}>
        <AccentBox
          backgroundColor={backgroundColor}
          className="accent-box-under-test"
        />
      </DeprecationWarningProvider>,
    );

    expect(renderedAccentBox()).toHaveClass(`flow--accent-box--${replacement}`);
    expect(onWarning).toHaveBeenCalledWith(
      `The color '${backgroundColor}' is deprecated and will be removed in a future release. Use '${replacement}' instead.`,
    );
  },
);

/**
 * The legacy `color` path takes the background value. Its warning names
 * `backgroundColor`: `color="gradient-navy"` would drop the gradient.
 */
test.each([
  ["gradient", "gradient-navy"],
  ["green", "sage"],
] as const)(
  "the legacy color '%s' renders as backgroundColor '%s' and says so",
  async (color, replacement) => {
    const onWarning = vi.fn();

    await render(
      <DeprecationWarningProvider onWarning={onWarning}>
        <AccentBox
          // @ts-expect-error -- the legacy background values on `color`
          color={color}
          className="accent-box-under-test"
        />
      </DeprecationWarningProvider>,
    );

    expect(renderedAccentBox()).toHaveClass(`flow--accent-box--${replacement}`);
    expect(onWarning).toHaveBeenCalledWith(
      `The color '${color}' is deprecated and will be removed in a future release. Use backgroundColor="${replacement}" instead.`,
    );
  },
);
