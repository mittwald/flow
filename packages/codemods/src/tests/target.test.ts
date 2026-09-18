import { describe, expect, test } from "vitest";
import { resolveTarget, type ResolveTargetResult } from "../resolve/target";

/** A registry snapshot shaped like the real one, including a stale tag. */
const versions = [
  "0.2.0-alpha.646",
  "0.2.0-experimental.776",
  "0.2.0",
  "1.0.0",
  "1.0.1",
  "1.0.5",
  "1.1.0-next.3",
  "1.1.0",
  "1.2.0",
  "2.0.0",
  "2.1.0",
];
const distTags = {
  latest: "1.2.0",
  next: "1.1.0-next.3",
  experimental: "0.2.0-experimental.776",
};

const result = (revision: string, current = "1.0.1"): ResolveTargetResult =>
  resolveTarget({ revision, current, versions, distTags });

const resolve = (revision: string, current = "1.0.1"): string | undefined => {
  const outcome = result(revision, current);
  return outcome.ok ? outcome.target : undefined;
};

describe("resolveTarget", () => {
  test("patch stays on the current minor", () => {
    expect(resolve("patch")).toBe("1.0.5");
  });

  test("minor stays inside the current major", () => {
    expect(resolve("minor")).toBe("1.2.0");
  });

  test("major takes the highest stable version", () => {
    expect(resolve("major")).toBe("2.1.0");
  });

  // #3117: the field report ran `list patch|minor|major` from 1.0.6 with no
  // stable 2.x published. `major` exited 0 on the same version `minor` found,
  // and nothing in any of the three outputs said the boundary was never
  // crossed — so the reader was told to weigh three targets that were two.
  describe("a keyword that resolved inside its own boundary says so", () => {
    /** No 2.x, so `major` has nothing above 1.x to reach. */
    const oneLine = ["1.0.0", "1.0.6", "1.1.0", "1.1.12"];

    const note = (revision: string, current: string, pool = oneLine) => {
      const outcome = resolveTarget({
        revision,
        current,
        versions: pool,
        distTags: {},
      });
      return outcome.ok ? outcome.note : undefined;
    };

    test("major that found no newer major names minor as its equal", () => {
      expect(note("major", "1.0.6")).toContain('"minor"');
      expect(note("major", "1.0.6")).toContain("1.x");
    });

    test("minor that found no newer minor names patch as its equal", () => {
      expect(note("minor", "1.1.0")).toContain('"patch"');
    });

    test("a keyword that did cross its boundary adds nothing", () => {
      expect(note("major", "1.0.1", versions)).toBeUndefined();
      expect(note("minor", "1.0.1", versions)).toBeUndefined();
    });

    // `patch` is the narrowest keyword — there is nothing below it to compare
    // against, so staying inside the patch line is the whole of its promise.
    test("patch never carries a note", () => {
      expect(note("patch", "1.0.6")).toBeUndefined();
      expect(note("patch", "1.0.1", versions)).toBeUndefined();
    });

    test("an exact version and a dist-tag carry no note", () => {
      const exact = resolveTarget({
        revision: "1.1.12",
        current: "1.0.6",
        versions: oneLine,
        distTags: {},
      });
      expect(exact.ok && exact.note).toBeUndefined();
    });
  });

  test("keyword resolution never lands on a prerelease", () => {
    expect(resolve("minor")).not.toContain("-");
    expect(resolve("major")).not.toContain("-");
  });

  test("a dist-tag resolves to whatever it points at, prerelease included", () => {
    expect(resolve("next")).toBe("1.1.0-next.3");
    expect(resolve("latest")).toBe("1.2.0");
  });

  test("an exact version is taken as given", () => {
    expect(resolve("1.1.0")).toBe("1.1.0");
  });

  test("an exact version that was never published is rejected", () => {
    expect(resolve("1.9.9")).toBeUndefined();
  });

  test("an unknown revision is rejected rather than guessed", () => {
    expect(resolve("sideways")).toBeUndefined();
  });

  test("patch from a version whose minor has no newer patch resolves to itself", () => {
    expect(resolve("patch", "1.2.0")).toBe("1.2.0");
  });

  test("a stale dist-tag resolves downwards — the caller has to reject it", () => {
    expect(resolve("experimental")).toBe("0.2.0-experimental.776");
  });

  // The shape most real consumers are on — this project published 983
  // `0.2.0-alpha.*` releases. A prerelease `current` resolves *upward* onto the
  // stable release of the same line, because `0.2.0 > 0.2.0-alpha.646`.
  test("a prerelease current resolves onto the stable release of its own line", () => {
    expect(resolve("patch", "0.2.0-alpha.646")).toBe("0.2.0");
    expect(resolve("minor", "0.2.0-alpha.646")).toBe("0.2.0");
  });

  test("major from a prerelease current reaches the newest stable line", () => {
    expect(resolve("major", "0.2.0-alpha.646")).toBe("2.1.0");
  });

  describe("the reason a revision does not resolve", () => {
    // versions/distTags above never leave `0.x` in prerelease-only shape, so
    // this suite uses its own fixture: a project on a `0.x` prerelease line
    // that never published a stable `0.x` release — the real-world case
    // (#minor is the default revision, and this is exactly the shape a
    // consumer mid alpha-to-1.0 catch-up is on).
    const alphaOnlyVersions = ["0.2.0-alpha.640", "0.2.0-alpha.646", "1.0.9"];
    const alphaOnlyDistTags = { latest: "1.0.9" };
    const alphaResult = (revision: string): ResolveTargetResult =>
      resolveTarget({
        revision,
        current: "0.2.0-alpha.640",
        versions: alphaOnlyVersions,
        distTags: alphaOnlyDistTags,
      });

    test("an unknown revision reports it, and lists the real dist-tags", () => {
      const outcome = result("sideways");
      expect(outcome).toEqual({
        ok: false,
        reason: {
          kind: "unrecognized",
          revision: "sideways",
          distTags: ["latest", "next", "experimental"],
        },
      });
    });

    test("an unknown dist-tag hits the same 'unrecognized' reason, and still lists the real tags", () => {
      const outcome = result("no-such-tag");
      expect(outcome).toEqual({
        ok: false,
        reason: {
          kind: "unrecognized",
          revision: "no-such-tag",
          distTags: ["latest", "next", "experimental"],
        },
      });
    });

    test("a valid keyword with no stable candidate names what it looked for and a broader escape", () => {
      const outcome = alphaResult("minor");
      expect(outcome).toEqual({
        ok: false,
        reason: {
          kind: "no-candidate",
          revision: "minor",
          describes: "the highest published stable release in 0.x",
          broader: { keyword: "major", target: "1.0.9" },
        },
      });
    });

    test("major with no stable candidate at all has no broader escape to name", () => {
      const outcome = resolveTarget({
        revision: "major",
        current: "0.2.0-alpha.640",
        versions: ["0.2.0-alpha.640", "0.2.0-alpha.646"],
        distTags: {},
      });
      expect(outcome).toEqual({
        ok: false,
        reason: {
          kind: "no-candidate",
          revision: "major",
          describes: "the highest published stable release",
          broader: undefined,
        },
      });
    });

    test("an unpublished exact version names the closest published one", () => {
      const outcome = result("1.9.9");
      expect(outcome).toEqual({
        ok: false,
        reason: { kind: "unpublished", revision: "1.9.9", closest: "1.2.0" },
      });
    });

    test("an unpublished exact version below everything published still names a closest", () => {
      const outcome = result("0.0.1");
      expect(outcome).toEqual({
        ok: false,
        reason: {
          kind: "unpublished",
          revision: "0.0.1",
          closest: "0.2.0-alpha.646",
        },
      });
    });
  });
});
