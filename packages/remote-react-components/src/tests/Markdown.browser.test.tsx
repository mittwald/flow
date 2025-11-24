import { renderRemoteTest } from "@/tests/renderRemoteTest";
import { expect, test } from "vitest";

test("Markdown is rendered", async () => {
  const dom = await renderRemoteTest("standard");
  const markdown = dom.getByTestId("markdown");
  await expect.element(markdown).toBeInTheDocument();
  expect(markdown.element().innerHTML).toMatchInlineSnapshot(
    `"<p class="flow--text flow--text--align-start">This is <strong>important</strong></p>"`,
  );
});
