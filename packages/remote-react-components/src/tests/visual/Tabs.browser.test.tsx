import { crossVersion, testEnvironments } from "@/tests/lib/environments";
import { expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";

test.each(testEnvironments)(
  "Tabs states (%s)",
  async ({
    testScreenshot,
    render,
    components: { TabTitle, Tab, Tabs, AlertIcon },
  }) => {
    await render(
      <Tabs disabledKeys={["3"]}>
        <Tab id="1">
          <TabTitle>
            Tab 1
            <AlertIcon />
          </TabTitle>
          Content
        </Tab>
        <Tab id="2">
          <TabTitle>Tab 2</TabTitle>
          Content
        </Tab>
        <Tab id="3">
          <TabTitle>Tab 3</TabTitle>
          Content
        </Tab>
      </Tabs>,
    );

    await testScreenshot("Tabs states");
  },
);

test.each(testEnvironments)(
  "Tabs interaction (%s)",
  async ({ testScreenshot, render, components: { TabTitle, Tab, Tabs } }) => {
    await render(
      <Tabs>
        <Tab id="1">
          <TabTitle>Tab 1</TabTitle>
          Content
        </Tab>
        <Tab id="2">
          <TabTitle data-testid="tab">Tab 2</TabTitle>
          Content
        </Tab>
        <Tab id="3">
          <TabTitle>Tab 3</TabTitle>
          Content
        </Tab>
      </Tabs>,
    );

    const trigger = page.getByTestId("tab");

    await testScreenshot("Tabs interaction - default");

    await trigger.click();

    await testScreenshot("Tabs interaction - Tab selected");
  },
);

test.each(testEnvironments)(
  "Tabs edge cases (%s)",
  async ({
    testScreenshot,
    render,
    components: { TabTitle, Tab, Tabs, Flex },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <Tabs>
          <Tab>
            <TabTitle>The Rebel Alliance versus the Empire</TabTitle>
            Content
          </Tab>
          <Tab>
            <TabTitle>The Rebel Alliance versus the Empire</TabTitle>
            Content
          </Tab>
          <Tab>
            <TabTitle>The Rebel Alliance versus the Empire</TabTitle>
            Content
          </Tab>
          <Tab>
            <TabTitle>The Rebel Alliance versus the Empire</TabTitle>
            Content
          </Tab>
          <Tab>
            <TabTitle>The Rebel Alliance versus the Empire</TabTitle>
            Content
          </Tab>
        </Tabs>
        <Tabs defaultSelectedKey="notFound">
          <Tab id="1">
            <TabTitle>Tab 1</TabTitle>
          </Tab>
          <Tab id="2">
            <TabTitle>Tab 2</TabTitle>
          </Tab>
        </Tabs>
        <Tabs>
          <Tab id="1">
            <TabTitle>Go</TabTitle>
            Content
          </Tab>
          <Tab id="2">
            <TabTitle>The Rebel Alliance versus the Empire</TabTitle>
            Content
          </Tab>
          <Tab id="3">
            <TabTitle>Ok</TabTitle>
            Content
          </Tab>
          <Tab id="4">
            <TabTitle>The Rebel Alliance versus the Empire</TabTitle>
            Content
          </Tab>
        </Tabs>
      </Flex>,
    );

    await testScreenshot("Tabs edge cases");
  },
);

// AccordionGroup shipped in 1.5.0.
test.skipIf(crossVersion({ below: "1.5.0" })).each(testEnvironments)(
  "Tabs panel overflow (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      TabTitle,
      Tab,
      Tabs,
      AccordionGroup,
      Accordion,
      Heading,
      Content,
    },
  }) => {
    await render(
      <Tabs>
        <Tab id="1">
          <TabTitle data-testid="accordion-tab">Accordions</TabTitle>
          <AccordionGroup>
            <Accordion>
              <Heading>First</Heading>
              <Content>Content</Content>
            </Accordion>
            <Accordion>
              <Heading>Second</Heading>
              <Content>Content</Content>
            </Accordion>
          </AccordionGroup>
        </Tab>
        <Tab id="2">
          <TabTitle>Tab 2</TabTitle>
          Content
        </Tab>
      </Tabs>,
    );

    // The accordion's focus ring reaches past the panel on both sides.
    await page.getByTestId("accordion-tab").click();
    await userEvent.keyboard("{tab}");
    await expect
      .element(page.getByRole("button", { name: "First" }))
      .toHaveFocus();

    await testScreenshot("Tabs panel overflow");
  },
);
