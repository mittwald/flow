import { afterEach, expect, test } from "vitest";
import SharedSegments from "./fixtures/SharedSegments.svelte";
import { cleanupRemote, renderRemote } from "./lib/environment.js";

/*
 * The Svelte counterpart of the React package's test of the same name.
 *
 * An object reference appearing more than once in a single mutation batch:
 * serialization parks a placeholder in its `seen` map while a value is in
 * flight, so a traversal visiting two members at the same time can read that
 * placeholder and serialize `undefined` instead of the value (#2894). The
 * symptom is silent — no error, no console output, the component renders empty.
 *
 * Svelte reaches the serializer the same way React does, and an app sharing one
 * `const` between two components is at least as likely.
 *
 * DonutChart carries it because `segments` is an array of objects whose `title`
 * the legend renders as text, so a lost reference is visible in the output.
 */
afterEach(() => cleanupRemote());

const expectRenderedTitleCount = async (
  container: Element,
  title: string,
  count: number,
) => {
  await expect
    .poll(
      () => (container.textContent?.match(new RegExp(title, "g")) ?? []).length,
      {
        timeout: 5000,
        message: `Expected "${title}" to reach the host ${count} time(s). A lower count means serialization dropped a repeated reference.`,
      },
    )
    .toBe(count);
};

test("two components sharing one object prop both receive it", async () => {
  // one array, handed to both charts — a module-level const in an extension
  const segments = [
    { value: 40, title: "SharedFirstSegment" },
    { value: 60, title: "SharedSecondSegment" },
  ];

  const { host } = renderRemote(SharedSegments, { segments });

  await expectRenderedTitleCount(host, "SharedFirstSegment", 2);
  await expectRenderedTitleCount(host, "SharedSecondSegment", 2);
});
