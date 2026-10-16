import { describe, expect, test } from "vitest";
import {
  flrGenerateComponents,
  flrUniversalExports,
  propsContextKeys,
} from "./remoteSurface";

/*
 * Both invariants fail the same way at runtime: the host renders nothing, and
 * nothing in the build, the types or the console says why. They are cheap to
 * check from the sources, so they are checked here instead of in review.
 */

describe("the remote surface", () => {
  test("has no component in both @flr-generate and flr-universal", () => {
    const generated = flrGenerateComponents();

    const inBoth = [...flrUniversalExports()].filter((name) =>
      generated.has(name),
    );

    /*
     * `remote-react-components/src/index.ts` star-exports both the generated
     * components and `flow-react-components/flr-universal`. A name both star
     * exports provide is ambiguous, and ESM resolves it to nothing — so the
     * component reaches the host as `undefined` ("Element type is invalid")
     * while every generated file for it exists and is committed.
     */
    expect(
      inBoth,
      `${inBoth.join(", ")} would resolve to undefined in remote-react-components. A component is either @flr-generate (the host materializes it from an flr-* element) or exported from flr-universal.ts (the remote app renders it itself) — not both.`,
    ).toStrictEqual([]);
  });

  test("puts only remote-capable components into a PropsContext", () => {
    const remoteCapable = flrGenerateComponents().union(flrUniversalExports());

    const unsupported = propsContextKeys().filter(
      ({ key }) => !remoteCapable.has(key),
    );

    /*
     * A props context configures a component by name. In a remote tree the host
     * only knows the names it can materialize, so an entry for a host-only
     * component silently does nothing there — the component renders without the
     * classes and defaults its surroundings meant to give it.
     */
    expect(
      unsupported.map(({ key, file }) => `${key} (${file})`),
      "These PropsContext entries name components that are neither @flr-generate nor exported from flr-universal.ts, so they have no effect in a remote tree.",
    ).toStrictEqual([]);
  });
});
