import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { expect, test } from "vitest";
import { BrowserOnly } from "@/components/BrowserOnly";
import { Text } from "@/components/Text";

/*
 * The content is held back until the component is mounted, so server and first
 * client render agree and nothing hydration-unsafe reaches the markup.
 */
test("the children appear once the component is mounted", async () => {
  await render(
    <BrowserOnly>
      <Text>Only in the browser</Text>
    </BrowserOnly>,
  );

  await expect.element(page.getByText("Only in the browser")).toBeVisible();
});
