import { render } from "vitest-browser-react";
import { expect, test } from "vitest";
import { Truncate } from "@/components/Truncate";
import styles from "./Truncate.module.scss";

const fileName = "a-very-long-backup-archive-from-last-december.tar.gz";

const shownText = () =>
  document.querySelector(`.${styles.truncate}`)?.textContent ?? "";

const renderInBox = (width: number, node: React.ReactNode) =>
  render(<div style={{ width }}>{node}</div>);

/*
 * Without `offset` or `ellipsis` the component leaves the text alone and lets
 * CSS cut it off, so the full string stays in the DOM for copy and search.
 */
test("the plain truncate keeps the whole text and cuts it with CSS", async () => {
  await renderInBox(80, <Truncate>{fileName}</Truncate>);

  expect(shownText()).toBe(fileName);
  expect(document.querySelector(`.${styles.truncate}`)).toHaveClass(
    styles.ellipsis,
  );
});

test("the title is passed on as the native tooltip", async () => {
  await renderInBox(80, <Truncate title={fileName}>{fileName}</Truncate>);

  expect(document.querySelector(`.${styles.truncate}`)).toHaveAttribute(
    "title",
    fileName,
  );
});

/*
 * With an `offset` the text is cut in its middle instead, so the end — where
 * the file extension lives — survives.
 */
test("an offset cuts the middle and keeps the end of the text", async () => {
  await renderInBox(120, <Truncate offset={10}>{fileName}</Truncate>);

  await expect.poll(shownText).not.toBe(fileName);
  expect(shownText()).toContain("...");
  expect(shownText().endsWith(fileName.slice(-10))).toBe(true);
  expect(shownText().length).toBeLessThan(fileName.length);
});

test("a custom ellipsis replaces the three dots", async () => {
  await renderInBox(
    120,
    <Truncate offset={10} ellipsis="…">
      {fileName}
    </Truncate>,
  );

  await expect.poll(shownText).not.toBe(fileName);
  expect(shownText()).toContain("…");
  expect(shownText()).not.toContain("...");
});

test("a text that fits is left whole", async () => {
  await renderInBox(600, <Truncate offset={10}>{fileName}</Truncate>);

  await expect.poll(shownText).toBe(fileName);
});
