import { expect, test, vitest } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { Tab, Tabs, TabTitle } from "@/components/Tabs";
import { Heading } from "@/components/Heading";
import { Section } from "@/components/Section";
import { Text } from "@/components/Text";
import type { ReactNode } from "react";

const testElement = (
  <Tabs>
    <Tab id="comms">
      <TabTitle>Comms</TabTitle>
      <Text>Comms panel</Text>
    </Tab>
    <Tab id="cargo">
      <TabTitle>Cargo hold</TabTitle>
      <Text>Cargo panel</Text>
    </Tab>
  </Tabs>
);

const renderTabs = (props: {
  "aria-label"?: string;
  "aria-labelledby"?: string;
  before?: ReactNode;
}) =>
  render(
    <>
      {props.before}
      <Tabs
        aria-label={props["aria-label"]}
        aria-labelledby={props["aria-labelledby"]}
      >
        <Tab id="general">
          <TabTitle>Comms</TabTitle>
          <Section>
            <Text>Comms</Text>
          </Section>
        </Tab>
        <Tab id="storage">
          <TabTitle>Cargo hold</TabTitle>
          <Section>
            <Text>Cargo hold</Text>
          </Section>
        </Tab>
      </Tabs>
    </>,
  );

test("First tab is selected when no selection is given", async () => {
  render(testElement);

  await expect
    .element(page.getByRole("tab", { name: "Comms" }))
    .toHaveAttribute("aria-selected", "true");
  await expect.element(page.getByText("Comms panel")).toBeVisible();
});

test("Selecting a tab shows its panel", async () => {
  render(testElement);

  await page.getByRole("tab", { name: "Cargo hold" }).click();

  await expect
    .element(page.getByRole("tab", { name: "Cargo hold" }))
    .toHaveAttribute("aria-selected", "true");
  await expect.element(page.getByText("Cargo panel")).toBeVisible();
});

/*
 * The tab titles reach the tab list through a tunnel, so react-aria picks the
 * default tab one commit after the first render. Tabs has to be controlled
 * before that happens, or the selection landing in its state flips it from
 * uncontrolled to controlled.
 */
test("Tabs do not switch from uncontrolled to controlled", async () => {
  const warn = vitest.spyOn(console, "warn");

  try {
    render(testElement);
    await expect
      .element(page.getByRole("tab", { name: "Comms" }))
      .toHaveAttribute("aria-selected", "true");

    expect(warn.mock.calls.flat().join("\n")).not.toContain(
      "uncontrolled to controlled",
    );
  } finally {
    warn.mockRestore();
  }
});

test("names the tab list with `aria-label`", async () => {
  renderTabs({ "aria-label": "Server settings" });

  await expect
    .element(page.getByRole("tablist", { name: "Server settings" }))
    .toBeInTheDocument();
});

test("names the tab list with `aria-labelledby`", async () => {
  renderTabs({
    "aria-labelledby": "tabs-heading",
    before: <Heading id="tabs-heading">Server settings</Heading>,
  });

  await expect
    .element(page.getByRole("tablist", { name: "Server settings" }))
    .toBeInTheDocument();
});
