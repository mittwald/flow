import { describe, expect, test } from "vitest";
import { parseArguments } from "../cli/args";
import {
  resolveSourcePath,
  runSingleCodemod,
  type CodemodCommandDeps,
} from "../cli/codemod";
import type { CodemodResult } from "../run/jscodeshift";

describe("resolveSourcePath", () => {
  test("an explicit relative path is resolved against cwd", () => {
    expect(resolveSourcePath("app", "/project", () => true)).toBe(
      "/project/app",
    );
  });

  test("an explicit absolute path is left alone", () => {
    expect(resolveSourcePath("/elsewhere/app", "/project", () => true)).toBe(
      "/elsewhere/app",
    );
  });

  test("src is the default when it exists", () => {
    expect(
      resolveSourcePath(undefined, "/project", (path) => path.endsWith("src")),
    ).toBe("/project/src");
  });

  test("the working directory is the fallback", () => {
    expect(resolveSourcePath(undefined, "/project", () => false)).toBe(
      "/project",
    );
  });
});

// `CodemodCommandDeps` takes an injectable `run` and `log` for exactly this —
// every branch below is reachable without touching a file or jscodeshift.
describe("runSingleCodemod", () => {
  const result = (over: Partial<CodemodResult> = {}): CodemodResult => ({
    changed: 1,
    unmodified: 0,
    skipped: 0,
    errors: 0,
    processedNothing: false,
    ...over,
  });

  const call = async (
    argv: string[],
    run: CodemodCommandDeps["run"],
  ): Promise<{ code: number; output: string }> => {
    const lines: string[] = [];
    const code = await runSingleCodemod(parseArguments(argv), {
      cwd: "/project",
      log: (message) => lines.push(message),
      run,
    });
    return { code, output: lines.join("\n") };
  };

  const ok = async () => result();

  test("an id that is not in the catalogue points at list", async () => {
    const { code, output } = await call(["no-such-thing", "src"], ok);
    expect(code).toBe(1);
    expect(output).toContain("no-such-thing");
    expect(output).toContain("flow-codemods list");
  });

  test("a catalogued id with no codemod prints apply and verify", async () => {
    const { code, output } = await call(
      ["table-render-prop-removed", "src"],
      ok,
    );
    expect(code).toBe(1);
    expect(output).toContain("apply:");
    expect(output).toContain("verify:");
  });

  test("a successful run ends with verify", async () => {
    const { code, output } = await call(["align-to-combine", "src"], ok);
    expect(code).toBe(0);
    expect(output).toContain("1 file(s) changed");
    expect(output).toContain("verify:");
  });

  test("errors are reported and fail", async () => {
    const { code, output } = await call(["align-to-combine", "src"], async () =>
      result({ changed: 0, errors: 2 }),
    );
    expect(code).toBe(1);
    expect(output).toContain("2 file(s) failed");
  });

  test("processing nothing is not reported as zero changes", async () => {
    const { code, output } = await call(["align-to-combine", "src"], async () =>
      result({ changed: 0, processedNothing: true }),
    );
    expect(code).toBe(1);
    expect(output).toContain("no files");
  });

  test("a transform that declines every file does not read as success", async () => {
    const { code, output } = await call(["align-to-combine", "src"], async () =>
      result({ changed: 0, skipped: 3 }),
    );
    expect(code).toBe(1);
    expect(output).toContain("declined all 3");
  });
});
