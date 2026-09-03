import { testEnvironments } from "@/tests/lib/environments";
import { expect, test } from "vitest";

/*
 * Payloads that broke in #2894: an object reference appearing more than once in
 * a single mutation batch. Serialization parks a placeholder in its `seen` map
 * while a value is in flight, so any traversal that visits two members at the
 * same time can read that placeholder and serialize `undefined` instead of the
 * value. The symptom is silent — no error, no console output, the component just
 * renders empty.
 *
 * Every scenario in the visual suite now crosses the real serializer too (the
 * `Remote` environment routes through FlowThreadSerialization), so this file is
 * not what makes serialization covered. What it adds is a payload shape no
 * screenshot exercises, asserted on the DOM rather than on pixels, with a
 * message that names the cause when it fails.
 *
 * DonutChart carries it because `segments` is an array of objects whose `title`
 * the legend renders as text, so a lost reference is visible in the output.
 */

/** Occurrences of `title` in the host output. One per chart that got it. */
const countRenderedTitle = (container: Element, title: string) =>
  (container.textContent?.match(new RegExp(title, "g")) ?? []).length;

const expectRenderedTitleCount = async (
  container: Element,
  title: string,
  count: number,
) => {
  await expect
    .poll(() => countRenderedTitle(container, title), {
      timeout: 5000,
      message: `Expected "${title}" to reach the host ${count} time(s). A lower count means serialization dropped a repeated reference.`,
    })
    .toBe(count);
};

test.each(testEnvironments)(
  "two components sharing one object prop both receive it (%s)",
  async ({ render, container, components: { Flex, DonutChart } }) => {
    // one array, handed to both charts — a module-level const in the demo app
    const segments = [
      { value: 40, title: "SharedFirstSegment" },
      { value: 60, title: "SharedSecondSegment" },
    ];

    await render(
      <Flex gap="s">
        <DonutChart aria-label="first" value={40} segments={segments} />
        <DonutChart aria-label="second" value={40} segments={segments} />
      </Flex>,
    );

    const element = container.element();

    await expectRenderedTitleCount(element, "SharedFirstSegment", 2);
    await expectRenderedTitleCount(element, "SharedSecondSegment", 2);
  },
);

test.each(testEnvironments)(
  "two components sharing one nested object both receive it (%s)",
  async ({ render, container, components: { Flex, DonutChart } }) => {
    /*
     * The same object reached through two different arrays, rather than through
     * one shared array. Each chart gets its own `segments`, so nothing about the
     * props is shared except the entry itself — the reference the two batches
     * collide on.
     *
     * The other shape of this, one array holding the same object twice, is
     * asserted on the serialized payload directly in remote-core's
     * FlowThreadSerialization tests. It cannot be expressed here: two entries
     * with one title collide on the legend's React keys.
     */
    const segment = { value: 25, title: "SharedNestedSegment" };

    await render(
      <Flex gap="s">
        <DonutChart aria-label="first" value={25} segments={[segment]} />
        <DonutChart aria-label="second" value={25} segments={[segment]} />
      </Flex>,
    );

    await expectRenderedTitleCount(
      container.element(),
      "SharedNestedSegment",
      2,
    );
  },
);
