import { ListModel } from "@/list/model";
import { describe, expect, test } from "vitest";

const loader = () => Promise.resolve({ data: [], itemTotalCount: 0 });

/* Whether handing the model these dependencies after `initial` loads again. */
const reloads = (initial: unknown[], next: unknown[]): boolean => {
  const list = new ListModel<never>({
    asyncLoader: loader,
    dependencies: initial,
  });
  list.loaderState.setBatchLoadingState(0, "loaded");

  list.updateSetup({ asyncLoader: loader, dependencies: next });

  /* A reset drops every batch's state, so the loader asks for them again. */
  return list.loaderState.batchLoadingStates[0] === undefined;
};

describe("A loader's dependencies", () => {
  test("load again when a Date changes", () => {
    expect(reloads([new Date("2026-09-10")], [new Date("2026-09-11")])).toBe(
      true,
    );
  });

  test("do not load again for an equal Date", () => {
    expect(reloads([new Date("2026-09-10")], [new Date("2026-09-10")])).toBe(
      false,
    );
  });

  test("load again when a Map or a Set changes", () => {
    expect(reloads([new Map([["ship", "Sulaco"]])], [new Map()])).toBe(true);
    expect(reloads([new Set(["Sulaco"])], [new Set(["Nostromo"])])).toBe(true);
  });

  test("load again when a value nested in a plain object changes", () => {
    expect(
      reloads(
        [{ ship: { name: "Sulaco", since: new Date("2026-09-10") } }],
        [{ ship: { name: "Sulaco", since: new Date("2026-09-11") } }],
      ),
    ).toBe(true);
  });

  test("survive a value that refers to itself", () => {
    const cyclic = () => {
      const ship: Record<string, unknown> = { name: "Sulaco" };
      ship.self = ship;
      return [ship];
    };

    expect(reloads(cyclic(), cyclic())).toBe(false);
  });

  test("ignore functions", () => {
    expect(
      reloads(
        [{ ship: "Sulaco", onDock: () => 1 }],
        [{ ship: "Sulaco", onDock: () => 2 }],
      ),
    ).toBe(false);
  });
});
