import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { Avatar } from "@/components/Avatar";
import { Initials } from "@/components/Initials";
import { DeprecationWarningProvider } from "@/components/DeprecationWarningProvider";

test("avatar is decorative and hidden from assistive technology by default", async () => {
  await render(
    <Avatar>
      <Initials>Luke Skywalker</Initials>
    </Avatar>,
  );

  const image = page.getByRole("img", { includeHidden: false });
  await expect.element(image).not.toBeInTheDocument();
});

test("a labelled avatar is exposed as a single labelled image", async () => {
  await render(
    <Avatar label="Luke Skywalker">
      <Initials>Luke Skywalker</Initials>
    </Avatar>,
  );

  // The whole avatar is announced as one unit, not as separate letters.
  const image = page.getByRole("img", { includeHidden: false });
  await expect.element(image).toHaveAccessibleName("Luke Skywalker");
});

test.each([
  ["violet", "lilac"],
  ["teal", "sage"],
] as const)(
  "the deprecated color '%s' renders as '%s' and warns",
  async (color, replacement) => {
    const onWarning = vi.fn();

    await render(
      <DeprecationWarningProvider onWarning={onWarning}>
        <Avatar color={color} label="Luke Skywalker">
          <Initials>Luke Skywalker</Initials>
        </Avatar>
      </DeprecationWarningProvider>,
    );

    await expect
      .element(page.getByRole("img", { name: "Luke Skywalker" }))
      .toHaveClass(`flow--avatar--${replacement}`);
    expect(onWarning).toHaveBeenCalledWith(
      `The color '${color}' is deprecated and will be removed in a future release. Use '${replacement}' instead.`,
    );
  },
);

test("the deprecated color 'green' keeps its look and points to 'sage'", async () => {
  const onWarning = vi.fn();

  await render(
    <DeprecationWarningProvider onWarning={onWarning}>
      <Avatar color="green" label="Luke Skywalker">
        <Initials>Luke Skywalker</Initials>
      </Avatar>
    </DeprecationWarningProvider>,
  );

  await expect
    .element(page.getByRole("img", { name: "Luke Skywalker" }))
    .toHaveClass("flow--avatar--green");
  expect(onWarning).toHaveBeenCalledWith(
    "The color 'green' is deprecated and will be removed in a future release. Use 'sage' instead.",
  );
});
