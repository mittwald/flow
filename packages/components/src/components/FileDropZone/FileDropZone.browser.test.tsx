import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import { expect, test, vi } from "vitest";
import { FileDropZone } from "@/components/FileDropZone";
import { FileField } from "@/components/FileField";
import { Button } from "@/components/Button";
import { Heading } from "@/components/Heading";
import styles from "./FileDropZone.module.scss";

const fileInput = () =>
  document.querySelector<HTMLInputElement>('input[type="file"]');

const textFile = (name: string) =>
  new File(["content"], name, { type: "text/plain" });

/*
 * react-aria's drop zone reads the native drag events, so a drop is three of
 * them carrying one `DataTransfer` – there is no user-event shortcut for it.
 */
const dropFiles = (files: File[]) => {
  const zone = document.querySelector(`.${styles.fileDropZone}`);

  // A missing zone would turn every "nothing happened" assertion into a pass.
  if (!zone) {
    throw new Error("The drop zone is not rendered.");
  }

  const dataTransfer = new DataTransfer();
  files.forEach((file) => dataTransfer.items.add(file));

  for (const type of ["dragenter", "dragover", "drop"]) {
    zone.dispatchEvent(
      new DragEvent(type, { dataTransfer, bubbles: true, cancelable: true }),
    );
  }
};

const renderZone = (props?: {
  accept?: string;
  multiple?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  onChange?: (files: FileList | null) => void;
}) =>
  render(
    <FileDropZone {...props}>
      <Heading>Drop a file</Heading>
      <FileField>
        <Button>Select file</Button>
      </FileField>
    </FileDropZone>,
  );

test("picking a file through the inner field reports it", async () => {
  const onChange = vi.fn();
  await renderZone({ onChange });

  await userEvent.upload(
    page.getByLocator('input[type="file"]'),
    textFile("notes.txt"),
  );

  await expect
    .poll(() => onChange.mock.lastCall?.[0]?.[0]?.name)
    .toBe("notes.txt");
});

test("accept and multiple reach the file input", async () => {
  await renderZone({ accept: "text/plain", multiple: true });

  expect(fileInput()).toHaveAttribute("accept", "text/plain");
  expect(fileInput()?.multiple).toBe(true);
});

test("a dropped file is reported and lands on the file input", async () => {
  const onChange = vi.fn();
  await renderZone({ onChange });

  dropFiles([textFile("dropped.txt")]);

  await expect
    .poll(() => onChange.mock.lastCall?.[0]?.[0]?.name)
    .toBe("dropped.txt");
  await expect.poll(() => fileInput()?.files?.[0]?.name).toBe("dropped.txt");
});

// Without `multiple` only the first of several dropped files is taken.
test("a single-file zone keeps only the first dropped file", async () => {
  const onChange = vi.fn();
  await renderZone({ onChange });

  dropFiles([textFile("first.txt"), textFile("second.txt")]);

  await expect.poll(() => onChange.mock.lastCall?.[0]?.length).toBe(1);
  expect(onChange.mock.lastCall?.[0]?.[0]?.name).toBe("first.txt");
});

test("a multiple zone keeps every dropped file", async () => {
  const onChange = vi.fn();
  await renderZone({ multiple: true, onChange });

  dropFiles([textFile("first.txt"), textFile("second.txt")]);

  await expect.poll(() => onChange.mock.lastCall?.[0]?.length).toBe(2);
});

test("accept filters out a dropped file of another type", async () => {
  const onChange = vi.fn();
  await renderZone({ accept: "image/png", onChange });

  dropFiles([textFile("notes.txt")]);

  await expect.poll(() => onChange.mock.calls.length).toBe(0);
});

test("a read-only zone ignores a drop", async () => {
  const onChange = vi.fn();
  await renderZone({ isReadOnly: true, onChange });

  dropFiles([textFile("dropped.txt")]);

  await expect.poll(() => onChange.mock.calls.length).toBe(0);
});

test("a disabled zone disables its file field", async () => {
  await renderZone({ isDisabled: true });

  await expect
    .element(page.getByRole("button", { name: "Select file" }))
    .toBeDisabled();
});
