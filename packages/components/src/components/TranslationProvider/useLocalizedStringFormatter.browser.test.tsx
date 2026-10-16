import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { beforeEach, expect, test, vi } from "vitest";
import { SearchField } from "@/components/SearchField";
import { Label } from "@/components/Label";

const compiledMessages = vi.hoisted(() => [] as string[]);

vi.mock(import("intl-messageformat"), async (importOriginal) => {
  const original = await importOriginal();

  class RecordingIntlMessageFormat extends original.default {
    public constructor(
      ...args: ConstructorParameters<typeof original.default>
    ) {
      super(...args);
      compiledMessages.push(`${String(args[1])}: ${String(args[0])}`);
    }
  }

  return { ...original, default: RecordingIntlMessageFormat };
});

beforeEach(() => {
  compiledMessages.length = 0;
});

const fields = (label: string) => (
  <>
    {[1, 2, 3].map((n) => (
      <SearchField key={n}>
        <Label>
          {label} {n}
        </Label>
      </SearchField>
    ))}
  </>
);

test("each message is compiled once, however often it is formatted", async () => {
  const screen = await render(fields("Domain"));
  await expect.element(page.getByRole("searchbox").first()).toBeVisible();

  await screen.rerender(fields("Host"));
  await expect
    .element(page.getByRole("searchbox").first())
    .toHaveAttribute("placeholder", "Search");

  expect(compiledMessages).toEqual([...new Set(compiledMessages)]);
});
