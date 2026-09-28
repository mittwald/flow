import { testEnvironments } from "@/tests/lib/environments";
import { expect, test, vi } from "vitest";
import { page } from "vitest/browser";

/*
 * The host copies, the remote app gets told. `Remote` has to carry the copied
 * text across the connection as the event's detail.
 */
test.each(testEnvironments)(
  "onCopy receives the copied text (%s)",
  async ({ render, components: { CopyButton } }) => {
    const writeText = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue();
    const onCopy = vi.fn();

    await render(<CopyButton text="ssh://rebelbase.org" onCopy={onCopy} />);

    await page.getByRole("button", { name: "Copy" }).click();

    await expect
      .poll(() => onCopy)
      .toHaveBeenCalledExactlyOnceWith("ssh://rebelbase.org");
    expect(writeText).toHaveBeenCalledWith("ssh://rebelbase.org");

    writeText.mockRestore();
  },
);
