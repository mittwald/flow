import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

test.each(testEnvironments)(
  "Separator (%s)",
  async ({ testScreenshot, render, components: { Separator } }) => {
    await render(<Separator />);

    await testScreenshot("Separator");
  },
);
