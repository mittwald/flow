import { expect, test } from "vitest";
import { AlertBadge } from "@/components/AlertBadge";
import { hydrateServerMarkup } from "@/lib/dev/hydrateServerMarkup";

test("A server-rendered alert badge hydrates in a paragraph", async () => {
  const errors = await hydrateServerMarkup(
    <p>
      <AlertBadge status="danger">Failed</AlertBadge>
    </p>,
  );

  expect(errors).toEqual([]);
});
