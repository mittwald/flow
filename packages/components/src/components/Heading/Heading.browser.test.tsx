import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { expect, test } from "vitest";
import { Heading } from "@/components/Heading";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { CopyButton } from "@/components/CopyButton";
import { AlertBadge } from "@/components/AlertBadge";
import styles from "./Heading.module.scss";

const heading = () => page.getByRole("heading");

test("the level picks the heading element", async () => {
  await render(<Heading level={3}>Project settings</Heading>);

  await expect.element(heading()).toBeInTheDocument();
  expect(document.querySelector("h3")?.textContent).toContain(
    "Project settings",
  );
});

test("level 2 is the default", async () => {
  await render(<Heading>Project settings</Heading>);

  expect(document.querySelector("h2")).not.toBeNull();
});

/*
 * `elementType` takes the heading out of the document outline – it then looks
 * like a heading but is not announced as one.
 */
test("elementType renders the heading without its role", async () => {
  await render(
    <Heading level={1} elementType="span">
      Project settings
    </Heading>,
  );

  await expect.element(heading()).not.toBeInTheDocument();
  expect(document.querySelector("span")?.textContent).toContain(
    "Project settings",
  );
});

/*
 * Badges and buttons are tunnelled into a container beside the title, whatever
 * their place among the children – the title text keeps a box of its own that
 * can be truncated without touching them.
 */
test("a badge is moved beside the title, not into it", async () => {
  await render(
    <Heading>
      <Badge>Beta</Badge>
      Project settings
    </Heading>,
  );

  expect(document.querySelector(`.${styles.headingText}`)?.textContent).toBe(
    "Project settings",
  );
  expect(document.querySelector(`.${styles.headingContent}`)?.textContent).toBe(
    "Beta",
  );
});

test("a button in the heading lands beside the title as well", async () => {
  await render(
    <Heading>
      Project settings
      <Button>Edit</Button>
    </Heading>,
  );

  expect(document.querySelector(`.${styles.headingText}`)?.textContent).toBe(
    "Project settings",
  );
  await expect
    .element(page.getByRole("button", { name: "Edit" }))
    .toBeVisible();
  expect(
    document
      .querySelector(`.${styles.headingContent}`)
      ?.querySelector("button"),
  ).not.toBeNull();
});

/*
 * Everything beside the title wraps one item at a time: a badge that no longer
 * fits must not take the CopyButton before it onto the next line, and starts
 * that line flush with the title instead of indented by the item spacing.
 */
test("a CopyButton stays beside the title when only the badge wraps", async () => {
  await render(
    <div style={{ width: 320 }}>
      <Heading>
        my-domain.de
        <CopyButton text="my-domain.de" />
        <AlertBadge status="danger">SSL request deadline exceeded</AlertBadge>
      </Heading>
    </div>,
  );

  const title = page
    .getByText("my-domain.de", { exact: true })
    .element()
    .getBoundingClientRect();
  const copyButton = page.getByRole("button").element().getBoundingClientRect();
  const badge = page
    .getByText("SSL request deadline exceeded")
    .element()
    .closest(`.${styles.headingContentItem}`)
    ?.getBoundingClientRect();

  expect(copyButton.top).toBeLessThan(title.bottom);
  expect(badge?.top).toBeGreaterThanOrEqual(title.bottom);
  expect(badge?.left).toBe(title.left);
});
