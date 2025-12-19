import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

test.each(testEnvironments)(
  "CopyButton (%s)",
  async ({ testScreenshot, render, components: { CopyButton } }) => {
    await render(<CopyButton text="text" />);

    await testScreenshot("CopyButton");
  },
);
