import { describe, expect, test } from "vitest";
import type { CatalogEntry } from "../catalog/entries";
import { createChoose } from "../cli/choose";

const entry = (id: string): CatalogEntry => ({
  id,
  title: id,
  since: "1.0.0",
  kind: "migration",
  action: "codemod",
  apply: `apply ${id}`,
  remotePackage: false,
});

const noPrompt = async (): Promise<string[]> => {
  throw new Error("the prompt should not have been shown");
};

describe("createChoose", () => {
  test("-y bypasses the prompt and passes everything through", async () => {
    const choose = createChoose({
      isCI: false,
      yes: true,
      isTTY: true,
      prompt: noPrompt,
      onCancel: () => undefined,
    });
    const entries = [entry("a"), entry("b")];

    await expect(choose(entries)).resolves.toEqual(entries);
  });

  test("a non-TTY bypasses the prompt and passes everything through", async () => {
    const choose = createChoose({
      isCI: false,
      onCancel: () => undefined,
      yes: false,
      isTTY: false,
      prompt: noPrompt,
    });
    const entries = [entry("a"), entry("b")];

    await expect(choose(entries)).resolves.toEqual(entries);
  });

  test("an empty list short-circuits without prompting", async () => {
    const choose = createChoose({
      isCI: false,
      onCancel: () => undefined,
      yes: false,
      isTTY: true,
      prompt: noPrompt,
    });

    await expect(choose([])).resolves.toEqual([]);
  });

  test("an interactive TTY prompts and filters down to the chosen ids", async () => {
    const entries = [entry("a"), entry("b"), entry("c")];
    const choose = createChoose({
      isCI: false,
      onCancel: () => undefined,
      yes: false,
      isTTY: true,
      prompt: async (offered) => {
        expect(offered).toEqual(entries);
        return ["b"];
      },
    });

    await expect(choose(entries)).resolves.toEqual([entry("b")]);
  });
});

/**
 * Ctrl+C at the prompt used to reject straight out of `runUpgrade`, after the
 * manifest was written and the install had run — the user's last output was an
 * inquirer stack trace instead of what had happened to their project.
 */
describe("a cancelled prompt", () => {
  test("runs no codemods and says the bump already happened", async () => {
    const messages: string[] = [];
    const choose = createChoose({
      isCI: false,
      yes: false,
      isTTY: true,
      prompt: () => Promise.reject(new Error("SIGINT")),
      onCancel: (message) => messages.push(message),
    });

    await expect(choose([entry("a"), entry("b")])).resolves.toEqual([]);
    expect(messages).toHaveLength(1);
    expect(messages[0]).toContain("already happened");
  });
});

/**
 * This used to come from a `process.env.CI` read inside `createChoose`, which
 * made the module behave differently on a runner than in any test — the reason
 * the cancel case above passed locally and failed in CI. Now it is an input,
 * and the behaviour it produces has its own case.
 */
describe("an unattended runner", () => {
  test("never prompts, even with a TTY", async () => {
    let prompted = false;
    const choose = createChoose({
      yes: false,
      isTTY: true,
      isCI: true,
      prompt: () => {
        prompted = true;
        return Promise.resolve([]);
      },
      onCancel: () => undefined,
    });

    const offered = [entry("a"), entry("b")];
    await expect(choose(offered)).resolves.toEqual(offered);
    expect(prompted).toBe(false);
  });
});
