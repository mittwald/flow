import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { runCodemod } from "../run/jscodeshift";

const project = (source: string): string => {
  const dir = mkdtempSync(join(tmpdir(), "flow-codemods-run-"));
  writeFileSync(join(dir, "input.tsx"), source);
  return dir;
};

const usesAlign = `import { Align } from "@mittwald/flow-react-components";
export const Row = () => <Align />;
`;

describe("runCodemod", () => {
  test("applies a codemod by its catalogue id and reports the change", () => {
    const dir = project(usesAlign);
    const result = runCodemod({ id: "align-to-combine", path: dir });

    expect(result.errors).toBe(0);
    expect(result.changed).toBe(1);
    expect(readFileSync(join(dir, "input.tsx"), "utf8")).toContain("Combine");
  });

  test("a file the codemod does not touch counts as unmodified, not an error", () => {
    const dir = project(`export const nothing = 1;\n`);
    const result = runCodemod({ id: "align-to-combine", path: dir });

    expect(result.errors).toBe(0);
    expect(result.changed).toBe(0);
    expect(result.unmodified).toBe(1);
  });

  test("--dry leaves the file alone", () => {
    const dir = project(usesAlign);
    runCodemod({ id: "align-to-combine", path: dir, dry: true });

    expect(readFileSync(join(dir, "input.tsx"), "utf8")).toContain("Align");
  });

  test("an unknown id fails with a message naming it", () => {
    const dir = project(usesAlign);
    expect(() => runCodemod({ id: "no-such-codemod", path: dir })).toThrow(
      /no-such-codemod/,
    );
  });
});
