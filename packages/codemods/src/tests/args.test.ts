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

  test("list takes a range and --json", () => {
    expect(
      parseArguments(["list", "--from", "1.0.0", "--to", "1.2.0", "--json"]),
    ).toMatchObject({
      command: "list",
      from: "1.0.0",
      to: "1.2.0",
      json: true,
    });
  });

  test("detect takes an optional path", () => {
    expect(parseArguments(["detect"])).toMatchObject({
      command: "detect",
      path: undefined,
    });
    expect(parseArguments(["detect", "src"])).toMatchObject({
      command: "detect",
      path: "src",
    });
  });

  test("verify takes an optional path", () => {
    expect(parseArguments(["verify"])).toMatchObject({
      command: "verify",
      path: undefined,
    });
    expect(parseArguments(["verify", "src"])).toMatchObject({
      command: "verify",
      path: "src",
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
