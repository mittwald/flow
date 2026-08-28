import { expect, test } from "vitest";
import { ThreadMessagePort } from "@quilted/threads";
import { FlowThreadSerialization } from "@/serialization/FlowThreadSerialization";

/*
 * Guards the message ordering of the patched `@quilted/threads`
 * (patches/@quilted__threads@3.3.1.patch).
 *
 * Upstream serializes synchronously, so a message is posted in the same stack
 * frame as the call that produced it and order is structural. This build
 * serializes asynchronously — Flow's serializers await File reads — and the
 * number of microtask turns a payload takes grows with its size. Without a
 * queue on each side, two calls made in one task race and the one that
 * serializes in fewer turns wins: a larger batch followed by a smaller one
 * arrives second.
 *
 * That matters because every remote-DOM mutation crosses this boundary. Applying
 * a batch out of order builds the wrong tree, silently — no error, nothing in
 * the console. React commonly produces exactly the losing shape: a large mount
 * batch followed immediately by a small update from an effect.
 *
 * `mutate` is not called directly here. It reaches the host as a thread function
 * whose proxy routes through `Thread#call`, which is what these exports exercise.
 */

interface OrderExports {
  record: (payload: readonly unknown[], label: string) => Promise<void>;
}

const batch = (size: number) =>
  Array.from({ length: size }, (_, index) => ({
    id: index,
    props: { name: `element-${index}`, index },
  }));

interface Harness {
  imports: OrderExports;
  recorded: string[];
  close: () => void;
}

const connectedThreads = (exports?: Partial<OrderExports>): Harness => {
  const { port1, port2 } = new MessageChannel();
  const recorded: string[] = [];

  new ThreadMessagePort<Record<string, never>, OrderExports>(port1, {
    serialization: new FlowThreadSerialization(),
    exports: {
      record: async (_payload, label) => {
        recorded.push(label);
      },
      ...exports,
    },
  });

  const remote = new ThreadMessagePort<OrderExports>(port2, {
    serialization: new FlowThreadSerialization(),
  });

  port1.start();
  port2.start();

  return {
    imports: remote.imports,
    recorded,
    close: () => {
      port1.close();
      port2.close();
    },
  };
};

/** Lets every queued send and its handler settle. */
const settle = () => new Promise((resolve) => setTimeout(resolve, 200));

test.each([
  // the shape that regressed: the earlier batch needs more turns to serialize
  { name: "a large batch before a small one", first: 500, second: 1 },
  { name: "a small batch before a large one", first: 1, second: 500 },
  { name: "two batches of equal size", first: 50, second: 50 },
  // even a one-element difference is enough to lose the race
  { name: "batches one element apart", first: 2, second: 1 },
])("keeps $name in call order", async ({ first, second }) => {
  const thread = connectedThreads();

  // both in one task, which is where the race lives — a real timer gap between
  // them hides it, so this must not await in between
  void thread.imports.record(batch(first), "first");
  void thread.imports.record(batch(second), "second");

  await settle();

  expect(thread.recorded).toStrictEqual(["first", "second"]);

  thread.close();
});

test("keeps order across many interleaved calls of mixed size", async () => {
  const thread = connectedThreads();
  const sizes = [40, 1, 7, 300, 2, 90, 1, 500, 3, 11];
  const labels = Array.from({ length: 40 }, (_, index) => `call-${index}`);

  labels.forEach((label, index) => {
    const size = sizes[index % sizes.length] ?? 1;
    void thread.imports.record(batch(size), label);
  });

  await settle();

  expect(thread.recorded).toStrictEqual(labels);

  thread.close();
});

/*
 * The receive side hands the queue on once the exported function has been
 * *invoked*, not once it settles. Ordering only needs the calls to start in
 * order, and waiting for completion would let one slow export stall every later
 * message — and deadlock outright if that export awaits a call back to this
 * thread. So a slow call must be overtakeable.
 */
test("does not let a slow export block later messages", async () => {
  const finished: string[] = [];
  const thread = connectedThreads({
    record: async (_payload, label) => {
      if (label === "slow") {
        await new Promise((resolve) => setTimeout(resolve, 150));
      }
      finished.push(label);
    },
  });

  const slow = thread.imports.record(batch(1), "slow");
  const fast = thread.imports.record(batch(1), "fast");

  await Promise.all([slow, fast]);

  expect(finished).toStrictEqual(["fast", "slow"]);

  thread.close();
});

test("keeps the thread usable after an export throws", async () => {
  const thread = connectedThreads({
    record: async (_payload, label) => {
      if (label === "boom") {
        throw new Error("export failed");
      }
      thread.recorded.push(label);
    },
  });

  await expect(thread.imports.record(batch(1), "boom")).rejects.toThrow();
  await thread.imports.record(batch(1), "after");

  expect(thread.recorded).toStrictEqual(["after"]);

  thread.close();
});
