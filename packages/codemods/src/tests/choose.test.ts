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
    const choose = createChoose({ yes: true, isTTY: true, prompt: noPrompt });
    const entries = [entry("a"), entry("b")];

    await expect(choose(entries)).resolves.toEqual(entries);
  });

  test("a non-TTY bypasses the prompt and passes everything through", async () => {
    const choose = createChoose({
      yes: false,
      isTTY: false,
      prompt: noPrompt,
    });
    const entries = [entry("a"), entry("b")];

    await expect(choose(entries)).resolves.toEqual(entries);
  });

  test("an empty list short-circuits without prompting", async () => {
    const choose = createChoose({
      yes: false,
      isTTY: true,
      prompt: noPrompt,
    });

    await expect(choose([])).resolves.toEqual([]);
  });

  test("an interactive TTY prompts and filters down to the chosen ids", async () => {
    // `CI` participates in the interactive gate (a `docker run -t` allocates a
    // TTY with nobody watching it), so this test — the one case that actually
    // wants the prompt shown — has to force the variable unset regardless of
    // what the outer environment (this test run itself may be CI) set it to.
    const originalCI = process.env.CI;
    delete process.env.CI;
    try {
      const entries = [entry("a"), entry("b"), entry("c")];
      const choose = createChoose({
        yes: false,
        isTTY: true,
        prompt: async (offered) => {
          expect(offered).toEqual(entries);
          return ["b"];
        },
      });

      await expect(choose(entries)).resolves.toEqual([entry("b")]);
    } finally {
      if (originalCI === undefined) {
        delete process.env.CI;
      } else {
        process.env.CI = originalCI;
      }
    }
  });
});
