import { describe, expect, test } from "vitest";
import { parseArguments } from "../cli/args";

describe("parseArguments", () => {
  test("no arguments asks for help", () => {
    expect(parseArguments([])).toMatchObject({ command: "help" });
  });

  test("--help and -h ask for help", () => {
    expect(parseArguments(["--help"])).toMatchObject({ command: "help" });
    expect(parseArguments(["-h"])).toMatchObject({ command: "help" });
  });

  test("--version asks for the version", () => {
    expect(parseArguments(["--version"])).toMatchObject({ command: "version" });
  });

  test("upgrade defaults its revision to minor", () => {
    expect(parseArguments(["upgrade"])).toMatchObject({
      command: "upgrade",
      revision: "minor",
    });
  });

  test("upgrade takes a revision", () => {
    expect(parseArguments(["upgrade", "next"])).toMatchObject({
      command: "upgrade",
      revision: "next",
    });
  });

  test("upgrade collects its flags", () => {
    expect(
      parseArguments(["upgrade", "major", "-y", "--allow-dirty", "--dry"]),
    ).toMatchObject({
      command: "upgrade",
      revision: "major",
      yes: true,
      allowDirty: true,
      dry: true,
    });
  });

  test("a bare list has no revision — that's what makes it the catalogue browser", () => {
    expect(parseArguments(["list"])).toMatchObject({
      command: "list",
      revision: undefined,
    });
  });

  test("list takes a revision, like upgrade", () => {
    expect(parseArguments(["list", "minor"])).toMatchObject({
      command: "list",
      revision: "minor",
    });
    expect(parseArguments(["list", "1.2.0"])).toMatchObject({
      command: "list",
      revision: "1.2.0",
    });
  });

  test("list and --json", () => {
    expect(parseArguments(["list", "minor", "--json"])).toMatchObject({
      command: "list",
      revision: "minor",
      json: true,
    });
  });

  test("an unknown first positional is a codemod id with an optional path", () => {
    expect(parseArguments(["align-to-combine", "src"])).toMatchObject({
      command: "codemod",
      id: "align-to-combine",
      path: "src",
    });
  });

  test("a codemod without a path leaves it unset", () => {
    expect(parseArguments(["align-to-combine"])).toMatchObject({
      command: "codemod",
      id: "align-to-combine",
      path: undefined,
    });
  });

  test("an unknown flag is an error, not a silent no-op", () => {
    expect(() => parseArguments(["upgrade", "--nope"])).toThrow();
  });
});
