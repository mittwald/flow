/* React internals, read-only: just enough to count fibers. */
interface Fiber {
  child: Fiber | null;
  sibling: Fiber | null;
}

interface HostRootFiber {
  stateNode: { current: Fiber };
}

/**
 * Counts the React fibers below the root mounted into `container` — the
 * `container` that `render()` from `vitest-browser-react` returns.
 */
export const countFibers = (container: Element) => {
  const key = Object.keys(container).find((k) =>
    k.startsWith("__reactContainer$"),
  );
  if (!key) {
    throw new Error("No React root is mounted into the container");
  }
  /*
   * The container keeps the HostRoot fiber it was created with. After an odd
   * number of commits that is the stale alternate, so go through the FiberRoot.
   */
  const hostRoot = (container as unknown as Record<string, HostRootFiber>)[key];
  let count = 0;
  const walk = (start: Fiber | null) => {
    for (let fiber = start; fiber; fiber = fiber.sibling) {
      count++;
      walk(fiber.child);
    }
  };
  walk(hostRoot?.stateNode.current.child ?? null);
  return count;
};
