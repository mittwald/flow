import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import { page } from "vitest/browser";

test.each(testEnvironments)(
  "Switch states (%s)",
  async ({ testScreenshot, render, components: { Flex, Switch, Label } }) => {
    await render(
      <Flex direction="column" gap="m">
        <Switch>
          <Label>Default</Label>
        </Switch>
        <Switch defaultSelected>
          <Label>Selected</Label>
        </Switch>
        <Switch isReadOnly>
          <Label>Readonly</Label>
        </Switch>
        <Switch isDisabled>
          <Label>Disabled</Label>
        </Switch>
        <Switch isDisabled defaultSelected>
          <Label>Disabled selected</Label>
        </Switch>
        <Switch labelPosition="leading">
          <Label>Label leading</Label>
        </Switch>
      </Flex>,
    );

    await testScreenshot("Switch states");
  },
);

test.each(testEnvironments)(
  "Switch interaction (%s)",
  async ({ testScreenshot, render, components: { Switch, Label } }) => {
    await render(
      <Switch data-testid="trigger">
        <Label>Label</Label>
      </Switch>,
    );

    const trigger = page.getByTestId("trigger");

    await testScreenshot("Switch interaction - default");

    await trigger.click();

    await testScreenshot("Switch interaction - selected");
  },
);

test.each(testEnvironments)(
  "Switch edge cases (%s)",
  async ({ testScreenshot, render, components: { Switch, Label } }) => {
    await render(
      <Switch>
        <Label>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius
          quam quas vel voluptas, ullam aliquid fugit. Voluptate harum
          accusantium rerum ullam modi blanditiis vitae, laborum ea tempore,
          dolore voluptas.
        </Label>
      </Switch>,
    );

    await testScreenshot("Switch edge cases");
  },
);
