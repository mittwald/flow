import { testEnvironments } from "@/tests/lib/environments";
import { expect, test } from "vitest";

test.each(testEnvironments)(
  "CopyButton (%s)",
  async ({ container, render, components: { CopyButton } }) => {
    await render(<CopyButton text="text" />);

    await expect(container).toMatchScreenshot("CopyButton");
  },
);
