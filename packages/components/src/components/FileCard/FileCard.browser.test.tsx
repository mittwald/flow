import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { expect, test, vi } from "vitest";
import { FileCard } from "@/components/FileCard";

const deleteButton = () => page.getByRole("button", { name: "delete" });

test("the name is shown", async () => {
  await render(<FileCard name="backup.tar.gz" />);

  await expect.element(page.getByText("backup.tar.gz")).toBeVisible();
});

/*
 * The size arrives in bytes and is shown in the unit it deserves – the card is
 * the only place that conversion happens.
 */
test("the size is shown in a compact unit", async () => {
  await render(<FileCard name="backup.tar.gz" sizeInBytes={5_400_000} />);

  await expect.element(page.getByText("5.4MB")).toBeVisible();
});

test("a size of zero is left out", async () => {
  await render(<FileCard name="empty.txt" sizeInBytes={0} />);

  await expect.element(page.getByText(/B$/)).not.toBeInTheDocument();
});

test("onDelete adds a delete button that reports the press", async () => {
  const onDelete = vi.fn();

  await render(<FileCard name="backup.tar.gz" onDelete={onDelete} />);

  await deleteButton().click();

  expect(onDelete).toHaveBeenCalledTimes(1);
});

test("without onDelete there is no delete button", async () => {
  await render(<FileCard name="backup.tar.gz" />);

  await expect.element(deleteButton()).not.toBeInTheDocument();
});

test("href turns the card into a link", async () => {
  await render(<FileCard name="backup.tar.gz" href="#download" download />);

  await expect
    .element(page.getByRole("link", { name: /backup.tar.gz/ }))
    .toHaveAttribute("href", "#download");
});

/*
 * A failed upload has nothing to open, so the card drops its link even when one
 * was passed.
 */
test("a failed card is not a link", async () => {
  await render(<FileCard name="backup.tar.gz" href="#download" isFailed />);

  await expect.element(page.getByRole("link")).not.toBeInTheDocument();
  await expect.element(page.getByText("backup.tar.gz")).toBeVisible();
});

test("elementType renders the card as a list item", async () => {
  await render(
    <ul>
      <FileCard name="backup.tar.gz" elementType="li" />
    </ul>,
  );

  await expect.element(page.getByRole("listitem")).toBeInTheDocument();
});

test("onPress reports a press on the card", async () => {
  const onPress = vi.fn();

  await render(<FileCard name="backup.tar.gz" onPress={onPress} />);

  await page.getByText("backup.tar.gz").click();

  expect(onPress).toHaveBeenCalledTimes(1);
});
