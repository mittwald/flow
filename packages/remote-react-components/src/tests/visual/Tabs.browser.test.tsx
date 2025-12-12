import { testEnvironments } from "@/tests/lib/environments";
import { expect, test } from "vitest";
import React from "react";
import { page } from "vitest/browser";

test.each(testEnvironments)(
  "Tabs states (%s)",
  async ({
    container,
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

    await expect(container).toMatchScreenshot("Tabs states");
  },
);

test.each(testEnvironments)(
  "Tabs interaction (%s)",
  async ({ container, render, components: { TabTitle, Tab, Tabs } }) => {
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

    await expect(container).toMatchScreenshot("Tabs interaction - default");

    await trigger.click();

    await expect(container).toMatchScreenshot(
      "Tabs interaction - Tab selected",
    );
  },
);

test.each(testEnvironments)(
  "Tabs edge cases (%s)",
  async ({ container, render, components: { TabTitle, Tab, Tabs } }) => {
    await render(
      <Tabs>
        <Tab>
          <TabTitle>Lorem ipsum dolor sit amet consectetur</TabTitle>
          Content
        </Tab>
        <Tab>
          <TabTitle>Lorem ipsum dolor sit amet consectetur</TabTitle>
          Content
        </Tab>
        <Tab>
          <TabTitle>Lorem ipsum dolor sit amet consectetur</TabTitle>
          Content
        </Tab>
        <Tab>
          <TabTitle>Lorem ipsum dolor sit amet consectetur</TabTitle>
          Content
        </Tab>
        <Tab>
          <TabTitle>Lorem ipsum dolor sit amet consectetur</TabTitle>
          Content
        </Tab>
      </Tabs>,
    );

    await expect(container).toMatchScreenshot("Tabs edge cases");
  },
);
