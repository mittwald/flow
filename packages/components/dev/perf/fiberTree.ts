import type { FC } from "react";
import { defined, getHost } from "./harness";

/* React internals, read-only: just enough to count and name fibers. */
interface Fiber {
  child: Fiber | null;
  sibling: Fiber | null;
  type: unknown;
  elementType: unknown;
  tag: number;
}

interface HostRootFiber {
  stateNode: { current: Fiber };
}

/** Calls `visit` for every fiber below the mounted root. */
export const walkFibers = (visit: (fiber: Fiber) => void) => {
  const host = defined(getHost(), "mounted root");
  const key = defined(
    Object.keys(host).find((k) => k.startsWith("__reactContainer$")),
    "React container key",
  );
  /*
   * The container keeps the HostRoot fiber it was created with. After an odd
   * number of commits that is the stale alternate, so go through the FiberRoot.
   */
  const hostRoot = (host as unknown as Record<string, HostRootFiber>)[key];
  const walk = (start: Fiber | null) => {
    for (let f = start; f; f = f.sibling) {
      visit(f);
      walk(f.child);
    }
  };
  walk(defined(hostRoot, "HostRoot fiber").stateNode.current.child);
};

export const countFibers = () => {
  let total = 0;
  walkFibers(() => total++);
  return total;
};

type FiberType =
  | string
  | {
      displayName?: string;
      render?: { name?: string };
      type?: { name?: string; displayName?: string };
      $$typeof?: symbol;
    }
  | FC
  | null;

export const fiberName = (fiber: Fiber): string => {
  const t = (fiber.elementType ?? fiber.type) as FiberType;
  if (typeof t === "string") return `<${t}>`;
  if (typeof t === "function") return t.displayName || t.name || "(anonymous)";
  if (t) {
    return (
      t.displayName ||
      t.render?.name ||
      t.type?.displayName ||
      t.type?.name ||
      (t.$$typeof
        ? String(t.$$typeof).replace(/Symbol\((react\.)?|\)/g, "")
        : "(object)")
    );
  }
  return `(tag ${fiber.tag})`;
};
