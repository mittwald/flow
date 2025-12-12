import { testEnvironments } from "@/tests/lib/environments";
import { expect, test } from "vitest";

test.each(testEnvironments)(
  "Separator (%s)",
  async ({ container, render, components: { Separator } }) => {
    await render(<Separator />);

    await expect(container).toMatchScreenshot("Separator");
  },
);
