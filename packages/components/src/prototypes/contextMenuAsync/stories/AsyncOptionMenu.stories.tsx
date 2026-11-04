import type { Meta, StoryObj } from "@storybook/react";
import { AsyncOptionMenu } from "../AsyncOptionMenu";
import { createFakeBackend } from "../lib/fakeBackend";

/**
 * PROTOTYPE for issue #1851 — not a public component. The visual and
 * interaction design is UX's call; this only demonstrates the mechanics.
 */
const meta: Meta<typeof AsyncOptionMenu> = {
  title: "Prototypes/AsyncOptionMenu",
  component: AsyncOptionMenu,
  args: {
    label: "Labels",
    load: createFakeBackend(),
  },
  parameters: {
    controls: { disable: true },
  },
};
export default meta;

type Story = StoryObj<typeof AsyncOptionMenu>;

/** 5000 server-side options, 25 per page, 400 ms latency. */
export const Default: Story = {};

/** Selected options stay pinned above the results, GitHub-style. */
export const PinSelected: Story = {
  args: { selectedOptionBehavior: "pin" },
};

/**
 * Selected options are only shown when the current page or filter contains
 * them. The selection still survives — it is just not visible.
 */
export const InlineSelected: Story = {
  args: { selectedOptionBehavior: "inline" },
};

/** Slow backend — shows the loading states and that typing cancels in flight. */
export const SlowBackend: Story = {
  args: { load: createFakeBackend({ latencyMs: 1500 }) },
};

/** A small universe that fits in one page — no "load more". */
export const SinglePage: Story = {
  args: { load: createFakeBackend({ total: 8, latencyMs: 200 }) },
};

/**
 * Where the ceiling actually is: paging switched off, so the whole universe
 * lands in the collection at once. This is the shape today's `ContextMenu`
 * already has when a caller renders every `MenuItem` — the prototype exists to
 * avoid it, and this story is here to measure it.
 */
export const UnpagedStress: Story = {
  args: {
    load: createFakeBackend({ total: 2000, pageSize: 2000, latencyMs: 0 }),
  },
};
