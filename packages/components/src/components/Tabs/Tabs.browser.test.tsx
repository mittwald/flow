import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { Tab, Tabs, TabTitle } from "@/components/Tabs";
import { Heading } from "@/components/Heading";
import { Section } from "@/components/Section";
import { Text } from "@/components/Text";
import type { ReactNode } from "react";

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
