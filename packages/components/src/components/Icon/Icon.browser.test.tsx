import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { DeprecationWarningProvider } from "@/components/DeprecationWarningProvider";
import { IconProject } from "@/components/Icon/components/icons";

test.each([
  ["violet", "lilac"],
  ["teal", "sage"],
] as const)(
  "the deprecated color '%s' renders as '%s' and warns",
  async (color, replacement) => {
    const onWarning = vi.fn();

    await render(
      <DeprecationWarningProvider onWarning={onWarning}>
        <IconProject aria-label="Project" color={color} />
      </DeprecationWarningProvider>,
    );

    await expect
      .element(page.getByRole("img", { name: "Project" }))
      .toHaveClass(`flow--icon--${replacement}`);
    expect(onWarning).toHaveBeenCalledWith(
      `The color '${color}' is deprecated and will be removed in a future release. Use '${replacement}' instead.`,
    );
  },
);
