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

  // #3117: the prompt in the upgrade docs claimed `major` fails when no next
  // major exists. It does not — `keywordRange` gives it `*`, so it resolves to
  // whatever `minor` resolves to and exits 0, saying nothing about it. A reader
  // comparing `list minor` against `list major` then sees two identical reports
  // and presents three targets where there are two.
  describe("a keyword that did not cross the boundary it offered to", () => {
    const stayedWithin = (
      revision: string,
      current = "1.0.1",
    ): string | undefined => {
      const outcome = result(revision, current);
      return outcome.ok ? outcome.stayedWithin : undefined;
    };

    test("major reports it when nothing above the current major is published", () => {
      // Only 1.x in this fixture, so `major` lands inside it.
      const outcome = resolveTarget({
        revision: "major",
        current: "1.0.1",
        versions: ["1.0.1", "1.1.12"],
        distTags: {},
      });
      expect(outcome).toEqual({
        ok: true,
        target: "1.1.12",
        stayedWithin: "major",
      });
    });

    test("major says nothing when it really crossed", () => {
      expect(stayedWithin("major")).toBeUndefined();
      expect(resolve("major")).toBe("2.1.0");
    });

    test("minor reports it when the newest release is on the current minor", () => {
      expect(stayedWithin("patch", "1.2.0")).toBeUndefined();
      expect(stayedWithin("minor", "1.2.0")).toBe("minor");
    });

    test("patch never reports it — it never offered to cross anything", () => {
      expect(stayedWithin("patch")).toBeUndefined();
    });

    test("an exact version and a dist-tag never report it", () => {
      expect(stayedWithin("1.1.0")).toBeUndefined();
      expect(stayedWithin("latest")).toBeUndefined();
    });
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
