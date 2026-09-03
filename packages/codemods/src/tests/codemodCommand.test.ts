import { describe, expect, test } from "vitest";
import { parseArguments } from "../cli/args";
import {
  displaySourcePath,
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

describe("displaySourcePath", () => {
  test("an explicit path is printed as the reader typed it", () => {
    // Not resolved against cwd: this goes into a copy-pasteable command, and an
    // absolute path there is both longer and no more correct.
    expect(displaySourcePath("packages/ui/lib", "/project", () => true)).toBe(
      "packages/ui/lib",
    );
  });

  test("src when src exists", () => {
    expect(
      displaySourcePath(undefined, "/project", (path) => path.endsWith("src")),
    ).toBe("src");
  });

  test("a dot when it does not — never an omitted argument", () => {
    // A printed command with no path argument would default back to `src`,
    // which is the tree this project does not have.
    expect(displaySourcePath(undefined, "/project", () => false)).toBe(".");
  });

  test("agrees with resolveSourcePath about which tree it means", () => {
    const exists = (path: string) => path.endsWith("src");
    expect(resolveSourcePath(undefined, "/project", exists)).toBe(
      "/project/src",
    );
    expect(displaySourcePath(undefined, "/project", exists)).toBe("src");
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

  test("a catalogued id with no codemod prints apply", async () => {
    const { code, output } = await call(
      ["table-render-prop-removed", "src"],
      ok,
    );
    expect(code).toBe(1);
    expect(output).toContain("apply:");
  });

  // `to-remote-package` is a transform with no catalogue entry — a deliberate
  // port, not a migration (see `notAMigration` in `remoteScope.test.ts`). It
  // must stay runnable by id even though `allEntries.find` never finds it.
  test("an id with a transform but no catalogue entry still runs", async () => {
    const { code, output } = await call(["to-remote-package", "src"], ok);
    expect(code).toBe(0);
    expect(output).toContain("Running to-remote-package over");
    // No catalogue entry means no anchor in MIGRATION.md to point at — pointing
    // there anyway would be a dead link.
    expect(output).not.toContain("MIGRATION.md");
  });

  test("a successful run ends with a pointer to the migration guide", async () => {
    const { code, output } = await call(["align-to-combine", "src"], ok);
    expect(code).toBe(0);
    expect(output).toContain("1 file(s) changed");
    expect(output).toContain("MIGRATION.md#align-to-combine");
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
