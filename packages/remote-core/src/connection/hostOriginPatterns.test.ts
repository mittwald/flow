import { describe, expect, test } from "vitest";
import {
  createAllowedHostOriginMatcher,
  normalizeHostOrigin,
} from "@/connection/hostOriginPatterns";

describe("allowed host origin matcher", () => {
  test("matches exact origins after normalization", () => {
    const matches = createAllowedHostOriginMatcher([
      "https://host.example/path",
    ]);

    expect(matches("https://host.example")).toBe(true);
    expect(matches("https://other.example")).toBe(false);
  });

  test.each(["https://studio.mittwald.de", "https://a.b.mittwald.de"])(
    "matches wildcard subdomain %s",
    (origin) => {
      const matches = createAllowedHostOriginMatcher(["https://*.mittwald.de"]);

      expect(matches(origin)).toBe(true);
    },
  );

  test.each([
    "https://mittwald.de",
    "https://othermittwald.de",
    "https://mittwald.de.other.example",
    "http://studio.mittwald.de",
    "https://studio.mittwald.de:8443",
  ])("does not match wildcard boundary mismatch %s", (origin) => {
    const matches = createAllowedHostOriginMatcher(["https://*.mittwald.de"]);

    expect(matches(origin)).toBe(false);
  });

  test("matches wildcard patterns with a port", () => {
    const matches = createAllowedHostOriginMatcher(["http://*.localhost:3000"]);

    expect(matches("http://studio.localhost:3000")).toBe(true);
    expect(matches("http://studio.localhost")).toBe(false);
  });

  test.each([
    ["https://foo.*.de", "https://foo.bar.de"],
    ["https://*", "https://foo"],
    ["https://*.mittwald.de/path", "https://foo.mittwald.de"],
    ["*.mittwald.de", "https://foo.mittwald.de"],
  ])("drops invalid wildcard pattern %s", (pattern, candidate) => {
    const matches = createAllowedHostOriginMatcher([pattern]);

    expect(matches(candidate)).toBe(false);
  });

  test("drops invalid and opaque exact origins", () => {
    const matches = createAllowedHostOriginMatcher([
      "not an origin",
      "data:text/plain,host",
    ]);

    expect(matches("https://host.example")).toBe(false);
    expect(normalizeHostOrigin("data:text/plain,host")).toBeUndefined();
  });
});
