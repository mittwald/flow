import {
  mkdirSync,
  mkdtempSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { pruneStaleVersions } from "./pruneStaleVersions";

describe("pruneStaleVersions", () => {
  let installRoot: string;

  beforeEach(() => {
    installRoot = mkdtempSync(join(tmpdir(), "flow-cross-version-prune-"));
  });

  afterEach(() => {
    rmSync(installRoot, { recursive: true, force: true });
  });

  const install = (version: string): void => {
    const dir = join(installRoot, version, "node_modules");
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "marker"), version);
  };

  it("removes versions outside the target set and keeps the targets", () => {
    ["1.0.0", "1.2.9", "1.3.0", "1.3.3", "1.3.4"].forEach(install);

    const removed = pruneStaleVersions(installRoot, [
      "1.3.4",
      "1.3.0",
      "1.2.9",
    ]);

    expect(removed.sort()).toEqual(["1.0.0", "1.3.3"]);
    expect(readdirSync(installRoot).sort()).toEqual([
      "1.2.9",
      "1.3.0",
      "1.3.4",
    ]);
  });

  it("removes stray files next to the version directories", () => {
    install("1.3.4");
    writeFileSync(join(installRoot, "stray.json"), "{}");

    expect(pruneStaleVersions(installRoot, ["1.3.4"])).toEqual(["stray.json"]);
  });

  it("returns nothing when the install root does not exist yet", () => {
    expect(pruneStaleVersions(join(installRoot, "missing"), ["1.3.4"])).toEqual(
      [],
    );
  });
});
