import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { expect, test } from "vitest";
import { Accordion } from "@/components/Accordion";
import { Heading } from "@/components/Heading";
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
