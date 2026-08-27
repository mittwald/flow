import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import * as Aria from "react-aria-components";
import { Button } from "@/components/Button";
import { FileField } from "@/components/FileField";

/*
 * A list row with an href is a react-aria GridListItem link, and react-aria
 * suppresses the default action of every click inside such a row. Opening the
 * file dialog *is* the default action of FileInput's click on its hidden input,
 * so unless that click stops propagating, the dialog never opens — silently.
 */
test("Hidden input's click keeps its default action inside a link row", async () => {
  render(
    <Aria.GridList aria-label="Files">
      <Aria.GridListItem href="#" textValue="Certificate">
        <FileField>
          <Button>Select file</Button>
        </FileField>
      </Aria.GridListItem>
    </Aria.GridList>,
  );

  const trigger = page.getByRole("button", { name: "Select file" });
  await expect.element(trigger).toBeInTheDocument();

  const input = document.querySelector<HTMLInputElement>('input[type="file"]');
  let inputClick: MouseEvent | undefined;
  input?.addEventListener("click", (event) => {
    inputClick = event;
  });

  await trigger.click();

  expect(inputClick).toBeDefined();
  expect(inputClick?.defaultPrevented).toBe(false);
});
