import { testEnvironments } from "@/tests/lib/environments";
import { buttonScenarios } from "./Button.scenarios";
import { test } from "vitest";

for (const [name, scenario] of Object.entries(buttonScenarios)) {
  test.each(testEnvironments)(
    `${name} (%s)`,
    async ({ testScreenshot, render, components }) => {
      await render(scenario(components));
      await testScreenshot(name);
    },
  );
}
