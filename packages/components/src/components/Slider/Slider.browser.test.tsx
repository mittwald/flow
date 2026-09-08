import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { Slider } from "@/components/Slider";
import { Label } from "@/components/Label";

/**
 * The `<Label>` is tunnelled into the slider's value row, so it reaches
 * react-aria's label slot one step later than a plain child would. When that
 * step lands after the first commit, react-aria concludes the slider has no
 * label and warns about a missing accessible name — and the slider really is
 * unnamed until the next render.
 */
test("takes its accessible name from the Label child", async () => {
  const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

  const screen = await render(
    <Slider defaultValue={20}>
      <Label>Bounty</Label>
    </Slider>,
  );

  await expect
    .element(screen.getByRole("group"))
    .toHaveAccessibleName(/^Bounty/);

  expect(
    warn.mock.calls
      .flat()
      .map((argument) => String(argument))
      .filter((message) => message.includes("you must specify an aria-label")),
  ).toEqual([]);
});
