import { afterEach, describe, expect, test } from "vitest";
import {
  cleanupBothBindings,
  hostOutputOf,
  renderBothBindings,
} from "./lib/parity/environment.js";
import { parityScenarios } from "./lib/parity/scenarios.js";

/*
 * The same scenario through both bindings, compared on what the host rendered.
 *
 * This is what "test Svelte along with the remote rendering tests" can actually
 * mean. The visual suite in `remote-react-components` cannot take a third
 * environment — its scenarios are `(components) => ReactNode`, and a Svelte
 * binding has no way to render a React tree. A scenario that is *data* can be
 * built by both, and then the host output is the assertion: same component,
 * same props, same rendering, or the Svelte binding is wrong.
 *
 * It is cheaper than a screenshot and stricter in the way that matters here: it
 * compares the DOM the host produced, so a prop that never arrived shows up as
 * a missing attribute rather than as a few pixels.
 */
afterEach(() => cleanupBothBindings());

describe.each(parityScenarios)("$name", ({ node }) => {
  test("renders the same as the React binding", async () => {
    const { svelteHost, reactHost } = renderBothBindings(node);

    await expect
      .poll(() => hostOutputOf(reactHost), { timeout: 10_000 })
      .not.toBe("");

    await expect
      .poll(() => hostOutputOf(svelteHost), { timeout: 10_000 })
      .toBe(hostOutputOf(reactHost));
  });
});
