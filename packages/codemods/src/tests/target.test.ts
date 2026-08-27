import { describe, expect, test } from "vitest";
import { resolveTarget } from "../resolve/target";

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

const resolve = (revision: string, current = "1.0.1"): string | undefined =>
  resolveTarget({ revision, current, versions, distTags });

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
});
