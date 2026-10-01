import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { expect, test } from "vitest";
import { Accordion } from "@/components/Accordion";
import { Heading } from "@/components/Heading";
import { Label } from "@/components/Label";
import { Content } from "@/components/Content";
import { Text } from "@/components/Text";

const toggle = () => page.getByRole("button", { name: "Server details" });

/*
 * The collapsed content region carries `hidden`, which takes it out of the
 * accessibility tree and out of every role query – so it is reached through the
 * `aria-controls` of the toggle instead.
 */
const contentRegion = () => {
  const id = document
    .querySelector("[aria-controls]")
    ?.getAttribute("aria-controls");
  return id ? document.getElementById(id) : null;
};

const content = () => page.getByText("The server runs in Frankfurt.");

const renderAccordion = (defaultExpanded?: boolean) =>
  render(
    <Accordion defaultExpanded={defaultExpanded}>
      <Heading>Server details</Heading>
      <Content>
        <Text>The server runs in Frankfurt.</Text>
      </Content>
    </Accordion>,
  );

test("the heading becomes the toggle and the content starts collapsed", async () => {
  renderAccordion();

  await expect.element(toggle()).toHaveAttribute("aria-expanded", "false");
  expect(contentRegion()).toHaveAttribute("hidden");
});

test("the toggle expands and collapses the content", async () => {
  renderAccordion();

  await toggle().click();

  await expect.element(toggle()).toHaveAttribute("aria-expanded", "true");
  await expect.element(content()).toBeVisible();

  await toggle().click();

  await expect.element(toggle()).toHaveAttribute("aria-expanded", "false");
  await expect.poll(() => contentRegion()?.hasAttribute("hidden")).toBe(true);
});

test("defaultExpanded renders the content expanded", async () => {
  renderAccordion(true);

  await expect.element(toggle()).toHaveAttribute("aria-expanded", "true");
  await expect.element(content()).toBeVisible();
});

/*
 * The toggle is the element the press came from, so it has to survive the state
 * change it triggers – a header button that React remounts takes the focus with
 * it and drops the user back on the document.
 */
test("the toggle keeps the focus it received", async () => {
  renderAccordion(true);

  await toggle().click();

  await expect.element(toggle()).toHaveFocus();

  await toggle().click();

  await expect.element(toggle()).toHaveFocus();
});

const renderLabelAccordion = () =>
  render(
    <Accordion>
      <Label>Server details</Label>
      <Content>
        <Text>The server runs in Frankfurt.</Text>
      </Content>
    </Accordion>,
  );

/*
 * A label header wrapping the toggle in a <label> leaves the toggle nameless:
 * the name is computed from the label, whose only content is that same toggle.
 * Chromium reports an empty name for it, and every role-and-name query — this
 * one included — walks past the toggle as if it were not there.
 */
test("a label header names the toggle just like a heading header", async () => {
  renderLabelAccordion();

  await expect.element(toggle()).toBeInTheDocument();
});

test("a label header's toggle expands the content", async () => {
  renderLabelAccordion();

  await toggle().click();

  await expect.element(toggle()).toHaveAttribute("aria-expanded", "true");
  await expect.element(content()).toBeVisible();
});

test("the content region is named by the toggle", async () => {
  renderAccordion(true);

  await expect
    .element(page.getByRole("region", { name: "Server details" }))
    .toBeInTheDocument();
});
