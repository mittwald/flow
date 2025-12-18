import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import { page } from "vitest/browser";

test.each(testEnvironments)(
  "SegmentedControl (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      Flex,
      SegmentedControl,
      Label,
      FieldError,
      FieldDescription,
      ContextualHelpTrigger,
      ContextualHelp,
      Button,
      Segment,
    },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <SegmentedControl isRequired defaultValue="1">
          <Label>
            Default
            <ContextualHelpTrigger>
              <Button />
              <ContextualHelp />
            </ContextualHelpTrigger>
          </Label>
          <Segment value="1">Option 1</Segment>
          <Segment value="2">Option 2</Segment>
          <FieldDescription>FieldDescription</FieldDescription>
        </SegmentedControl>
        <SegmentedControl isInvalid>
          <Label>Invalid</Label>
          <Segment value="1">Option 1</Segment>
          <Segment value="2">Option 2</Segment>
          <FieldError>FieldError</FieldError>
        </SegmentedControl>
        <SegmentedControl isReadOnly defaultValue="1">
          <Label>Readonly</Label>
          <Segment value="1">Option 1</Segment>
          <Segment value="2">Option 2</Segment>
        </SegmentedControl>
        <SegmentedControl defaultValue="2">
          <Label>Option disabled</Label>
          <Segment value="1" isDisabled>
            Option 1
          </Segment>
          <Segment value="2">Option 2</Segment>
        </SegmentedControl>
      </Flex>,
    );

    await testScreenshot("SegmentedControl with Segment");
  },
);

test.each(testEnvironments)(
  "SegmentedControl interaction (%s)",
  async ({
    testScreenshot,
    render,
    components: { SegmentedControl, Segment, Label },
  }) => {
    await render(
      <SegmentedControl defaultValue="1">
        <Label>Label</Label>
        <Segment value="1">Option 1</Segment>
        <Segment value="2" data-testid="option">
          Option 2
        </Segment>
      </SegmentedControl>,
    );

    const option = page.getByTestId("option");

    await testScreenshot("SegmentedControl interaction - default");

    await option.click();

    await testScreenshot("SegmentedControl interaction - option selected");
  },
);

test.each(testEnvironments)(
  "SegmentedControl edge cases (%s)",
  async ({
    testScreenshot,
    render,
    components: { SegmentedControl, Segment, Label },
  }) => {
    await render(
      <SegmentedControl isRequired defaultValue="1">
        <Label>Label</Label>
        <Segment value="1">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius
          quam quas vel voluptas, ullam aliquid fugit. Voluptate harum
          accusantium rerum ullam modi blanditiis vitae, laborum ea tempore,
          dolore voluptas.
        </Segment>
        <Segment value="2">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius
          quam quas vel voluptas, ullam aliquid fugit. Voluptate harum
          accusantium rerum ullam modi blanditiis vitae, laborum ea tempore,
          dolore voluptas.
        </Segment>
        <Segment value="3">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius
          quam quas vel voluptas, ullam aliquid fugit. Voluptate harum
          accusantium rerum ullam modi blanditiis vitae, laborum ea tempore,
          dolore voluptas.
        </Segment>
      </SegmentedControl>,
    );

    await testScreenshot("SegmentedControl edge cases");
  },
);
