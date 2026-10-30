import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { Color } from "@/components/Color";
import { DeprecationWarningProvider } from "@/components/DeprecationWarningProvider";

test.each([
  ["violet", "lilac"],
  ["teal", "sage"],
] as const)(
  "the deprecated color '%s' renders as '%s' and warns",
  async (color, replacement) => {
    const onWarning = vi.fn();

    await render(
      <DeprecationWarningProvider onWarning={onWarning}>
        <Color color={color}>Force</Color>
      </DeprecationWarningProvider>,
    );

    await expect
      .element(page.getByText("Force"))
      .toHaveClass(`flow--color--${replacement}`);
    expect(onWarning).toHaveBeenCalledWith(
      `The color '${color}' is deprecated and will be removed in a future release. Use '${replacement}' instead.`,
    );
  },
);

test("a custom color passes through without a warning", async () => {
  const onWarning = vi.fn();

  await render(
    <DeprecationWarningProvider onWarning={onWarning}>
      <Color color="#0fdf00">Force</Color>
    </DeprecationWarningProvider>,
  );

  await expect
    .element(page.getByText("Force"))
    .toHaveStyle({ color: "rgb(15, 223, 0)" });
  expect(onWarning).not.toHaveBeenCalled();
});
