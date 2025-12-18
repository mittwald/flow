import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import { page } from "vitest/browser";

test.each(testEnvironments)(
  "Select states (%s)",
  async ({
    testScreenshot,
    render,
    components: { Flex, Select, Option, Label, FieldError, FieldDescription },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <Select isRequired>
          <Label>Default</Label>
          <Option>Option 1</Option>
          <Option>Option 2</Option>
          <FieldDescription>FieldDescription</FieldDescription>
        </Select>
        <Select isInvalid>
          <Label>Invalid</Label>
          <Option>Option 1</Option>
          <Option>Option 2</Option>
          <FieldError>FieldError</FieldError>
        </Select>
        <Select isReadOnly>
          <Label>Readonly</Label>
          <Option>Option 1</Option>
          <Option>Option 2</Option>
        </Select>
        <Select isDisabled>
          <Label>Disabled</Label>
          <Option>Option 1</Option>
          <Option>Option 2</Option>
        </Select>
      </Flex>,
    );

    await testScreenshot("Select states");
  },
);

test.each(testEnvironments)(
  "Select interaction (%s)",
  async ({ testScreenshot, render, components: { Select, Label, Option } }) => {
    await render(
      <Select>
        <Label>Label</Label>
        <Option data-testid="option">Option 1</Option>
        <Option>Option 2</Option>
      </Select>,
    );

    const select = page.getByLocator("button");
    const option = page.getByTestId("option");

    await testScreenshot("Select interaction - default");

    await select.click();

    await testScreenshot("Select interaction - options visible");

    await option.click();

    await testScreenshot("Select interaction - option selected");
  },
);

test.each(testEnvironments)(
  "Select edge cases (%s)",
  async ({ testScreenshot, render, components: { Select, Label, Option } }) => {
    await render(
      <Select selectedKey="1">
        <Label>Label</Label>
        <Option value="1">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius
          quam quas vel voluptas, ullam aliquid fugit. Voluptate harum
          accusantium rerum ullam modi blanditiis vitae, laborum ea tempore,
          dolore voluptas.
        </Option>
      </Select>,
    );

    await testScreenshot("Select edge cases");
  },
);
