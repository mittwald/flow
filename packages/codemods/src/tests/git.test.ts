import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { hasUncommittedChanges } from "../git";

const git = (cwd: string, args: string[]): void => {
  execFileSync("git", args, { cwd, stdio: "ignore" });
};

const initRepoWithCommittedFile = (): string => {
  const dir = mkdtempSync(join(tmpdir(), "flow-codemods-git-"));
  git(dir, ["init"]);
  writeFileSync(join(dir, "committed.txt"), "committed\n");
  git(dir, ["add", "committed.txt"]);
  git(dir, [
    "-c",
    "user.email=test@example.com",
    "-c",
    "user.name=test",
    "-c",
    "commit.gpgsign=false",
    "commit",
    "-m",
    "initial commit",
  ]);
  return dir;
};

describe("hasUncommittedChanges", () => {
  test("a freshly committed directory is clean", () => {
    const dir = initRepoWithCommittedFile();

    expect(hasUncommittedChanges(dir)).toBe(false);
  });

  test("an untracked file makes the tree dirty", () => {
    const dir = initRepoWithCommittedFile();
    writeFileSync(join(dir, "untracked.txt"), "untracked\n");

    expect(hasUncommittedChanges(dir)).toBe(true);
  });

  test("a modified tracked file makes the tree dirty", () => {
    const dir = initRepoWithCommittedFile();
    writeFileSync(join(dir, "committed.txt"), "changed\n");

    expect(hasUncommittedChanges(dir)).toBe(true);
  });

  test("a directory that is not a git repository counts as clean", () => {
    const dir = mkdtempSync(join(tmpdir(), "flow-codemods-git-"));

    expect(hasUncommittedChanges(dir)).toBe(false);
  });
});
