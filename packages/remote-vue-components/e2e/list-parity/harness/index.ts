import { reactBinding } from "./bindings/react";
import { vueBinding } from "./bindings/vue";
import {
  mountHost,
  readStableHostHtml,
  setNeutralPointerPosition,
  unmountHost,
  waitForHost,
} from "./host";
import { createSerializedReceiver } from "../../../../remote-react-components/src/tests/lib/serializedConnection";
import type { ParityBinding, ParityScenario } from "./types";
import { afterAll, describe, expect, test } from "vitest";

export type { ParityBinding, ParityScenario } from "./types";

/**
 * Every binding, reference first.
 *
 * The order is the contract: the first one produces the expected output and the
 * rest are measured against it. A third binding is appended here and gets a key
 * in every scenario; nothing else moves.
 */
export const bindings: readonly ParityBinding[] = [reactBinding, vueBinding];

const reference = bindings[0];
const compared = bindings.slice(1);

if (!reference) {
  throw new Error("The parity harness needs at least one binding.");
}

/** What the host built for one binding, after the scenario's interactions. */
const renderAndRead = async (
  binding: ParityBinding,
  scenario: ParityScenario,
): Promise<string> => {
  const tree = scenario.trees[binding.name];

  if (!tree) {
    throw new Error(
      `"${scenario.name}" has no tree for the "${binding.name}" binding. ` +
        `Write it, or drop the scenario — a binding that cannot express ` +
        `something is the finding, not a reason to skip.`,
    );
  }

  const host = mountHost();
  binding.mount(tree, host.remote, createSerializedReceiver(host.receiver));
  await waitForHost();
  await scenario.interact?.();
  await setNeutralPointerPosition();

  return readStableHostHtml();
};

/**
 * Asserts every binding makes the host build the same DOM.
 *
 * One binding at a time rather than side by side: the scenarios interact with
 * what they rendered through `page.getByRole(…)`, which has to find exactly one
 * tree. So each is mounted, driven and read in turn, and the host is torn down
 * in between.
 */
export const testParity = (
  suiteName: string,
  scenarios: readonly ParityScenario[],
  /**
   * Class names that must appear somewhere in what the scenarios compared.
   *
   * The scenarios prove that the bindings agree; this proves they were asked
   * about everything. Without it a component can drop out of every scenario and
   * the suite stays green on a smaller and smaller surface.
   */
  coverage: readonly string[] = [],
): void => {
  describe(suiteName, () => {
    const comparedHtml: string[] = [];

    afterAll(() => unmountHost());

    for (const scenario of scenarios) {
      test(scenario.name, async () => {
        const expected = await renderAndRead(reference, scenario);
        comparedHtml.push(expected);

        for (const binding of compared) {
          const actual = await renderAndRead(binding, scenario);

          expect(
            actual,
            `The ${binding.name} binding makes the host build a different tree than ${reference.name} does.`,
          ).toBe(expected);
        }
      });
    }

    if (coverage.length > 0) {
      test("the scenarios reach every component", () => {
        const missing = coverage.filter(
          (marker) => !comparedHtml.some((html) => html.includes(marker)),
        );

        expect(
          missing,
          "No scenario rendered these, so nothing above compared them.",
        ).toEqual([]);
      });
    }
  });
};
