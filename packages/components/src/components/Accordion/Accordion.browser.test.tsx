import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { expect, test, vi } from "vitest";
import { Accordion } from "@/components/Accordion";
import { Heading } from "@/components/Heading";
import { Label } from "@/components/Label";
import { Content } from "@/components/Content";
import { Text } from "@/components/Text";
import { Badge } from "@/components/Badge";
import { DeprecationWarningProvider } from "@/components/DeprecationWarningProvider";

const toggle = () => page.getByRole("button", { name: "Server details" });

/*
 * A collapsed panel carries `hidden`, which takes it out of the accessibility
 * tree and out of every role query – so it is reached through the
 * `aria-controls` of the toggle instead.
 */
const panel = () => {
  const id = document
    .querySelector("[aria-controls]")
    ?.getAttribute("aria-controls");
  const element = id ? document.getElementById(id) : null;
  if (!element) {
    throw new Error("The accordion panel is not rendered");
  }
  return element;
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
  await renderAccordion();

  await expect.element(toggle()).toHaveAttribute("aria-expanded", "false");
  expect(panel()).toHaveAttribute("hidden");
});

test("the toggle expands and collapses the content", async () => {
  await renderAccordion();

  await toggle().click();

  await expect.element(toggle()).toHaveAttribute("aria-expanded", "true");
  await expect.element(content()).toBeVisible();

  await toggle().click();

  await expect.element(toggle()).toHaveAttribute("aria-expanded", "false");
  await expect.poll(() => panel().hasAttribute("hidden")).toBe(true);
});

test("defaultExpanded renders the content expanded", async () => {
  await renderAccordion(true);

  await expect.element(toggle()).toHaveAttribute("aria-expanded", "true");
  await expect.element(content()).toBeVisible();
});

/*
 * The toggle is the element the press came from, so it has to survive the state
 * change it triggers – a header button that React remounts takes the focus with
 * it and drops the user back on the document.
 */
test("the toggle keeps the focus it received", async () => {
  await renderAccordion(true);

  await toggle().click();

  await expect.element(toggle()).toHaveFocus();

  await toggle().click();

  await expect.element(toggle()).toHaveFocus();
});

test("the content panel is named by the toggle", async () => {
  await renderAccordion(true);

  await expect
    .element(page.getByRole("group", { name: "Server details" }))
    .toBeInTheDocument();
});

/*
 * `until-found` keeps the collapsed content searchable: find-in-page fires
 * `beforematch` on the panel, which expands it.
 */
test("a collapsed panel stays searchable and expands on a find match", async () => {
  await renderAccordion();

  expect(panel()).toHaveAttribute("hidden", "until-found");

  panel().dispatchEvent(new Event("beforematch"));

  await expect.element(toggle()).toHaveAttribute("aria-expanded", "true");
});

test("a heading header is a heading containing the toggle", async () => {
  await render(
    <Accordion>
      <Heading level={3}>Server details</Heading>
      <Content>The server runs in Frankfurt.</Content>
    </Accordion>,
  );

  const heading = page.getByRole("heading", { level: 3 });
  await expect.element(heading).toHaveTextContent("Server details");
  await expect
    .element(heading.getByRole("button", { name: "Server details" }))
    .toBeInTheDocument();
});

test("a text header is a toggle without a heading", async () => {
  await render(
    <Accordion>
      <Text>Server details</Text>
      <Content>The server runs in Frankfurt.</Content>
    </Accordion>,
  );

  await expect.element(toggle()).toBeInTheDocument();
  await expect.element(page.getByRole("heading")).not.toBeInTheDocument();
});

test("a badge in the header is part of the toggle", async () => {
  await render(
    <Accordion>
      <Heading>
        Invoices
        <Badge>3 open</Badge>
      </Heading>
      <Content>The invoices.</Content>
    </Accordion>,
  );

  await expect
    .element(page.getByRole("button", { name: "Invoices 3 open" }))
    .toBeInTheDocument();
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
  await renderLabelAccordion();

  await expect.element(toggle()).toBeInTheDocument();
});

test("a label header's toggle expands the content", async () => {
  await renderLabelAccordion();

  await toggle().click();

  await expect.element(toggle()).toHaveAttribute("aria-expanded", "true");
  await expect.element(content()).toBeVisible();
});

test.each(["default", "outline"] as const)(
  "variant=%s warns that the prop is deprecated",
  async (variant) => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const onWarning = vi.fn();

    await render(
      <DeprecationWarningProvider onWarning={onWarning}>
        <Accordion variant={variant}>
          <Heading>Server details</Heading>
          <Content>The server runs in Frankfurt.</Content>
        </Accordion>
      </DeprecationWarningProvider>,
    );

    await expect
      .poll(() => onWarning.mock.calls.flat())
      .toContain(
        "The 'variant' prop of the 'Accordion' component is deprecated and will be removed in a future release. Use 'AccordionGroup' or a 'LayoutCard' to set accordions apart instead.",
      );
  },
);

const isRotated = (name: string) => {
  const chevron = page
    .getByRole("button", { name })
    .element()
    .querySelector(".flow--accordion--chevron");
  if (!chevron) {
    throw new Error(`No chevron in "${name}"`);
  }
  return getComputedStyle(chevron).transform !== "none";
};

/*
 * The expanded state turns the chevron of the accordion's own header only; a
 * collapsed accordion in its content keeps an unturned chevron.
 */
test("only the expanded accordion's own chevron turns", async () => {
  await render(
    <Accordion defaultExpanded>
      <Heading>Server details</Heading>
      <Content>
        <Accordion>
          <Heading>Backups</Heading>
          <Content>Daily at 3 am.</Content>
        </Accordion>
      </Content>
    </Accordion>,
  );

  await expect.poll(() => isRotated("Server details")).toBe(true);
  await expect.poll(() => isRotated("Backups")).toBe(false);
});
