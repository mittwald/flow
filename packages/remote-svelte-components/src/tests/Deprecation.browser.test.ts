import { page } from "vitest/browser";
import { afterEach, expect, test, vi } from "vitest";
import DeprecationScenario from "./fixtures/DeprecationScenario.svelte";
import { cleanupRemote, renderRemote } from "./lib/environment.js";

/*
 * How mStudio learns which deprecated paths an extension still uses: the
 * warning goes to the provider, `RemoteRoot` forwards it to the host. Warning
 * once per message is the part that matters — a component that warns on every
 * render must not fill the console, or the report.
 */
afterEach(() => cleanupRemote());

test("warns once per message, to the console and to the provider", async () => {
  const consoleWarn = vi
    .spyOn(console, "warn")
    .mockImplementation(() => undefined);
  const onWarning = vi.fn();

  renderRemote(DeprecationScenario, { onWarning });

  await page.getByRole("button", { name: "Warn twice" }).click();

  await vi.waitFor(() => expect(onWarning).toHaveBeenCalledTimes(1));
  expect(onWarning).toHaveBeenCalledWith("The 'x' prop is deprecated.");
  expect(consoleWarn).toHaveBeenCalledTimes(1);

  consoleWarn.mockRestore();
});
