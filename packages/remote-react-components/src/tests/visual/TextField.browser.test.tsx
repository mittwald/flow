import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import { page, userEvent } from "vitest/browser";

test.each(testEnvironments)(
  "TextField states (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      Flex,
      TextField,
      Label,
      FieldError,
      FieldDescription,
      ContextualHelpTrigger,
      ContextualHelp,
      Button,
      IconStar,
    },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <TextField isRequired>
          <Label>
            Default
            <ContextualHelpTrigger>
              <Button />
              <ContextualHelp />
            </ContextualHelpTrigger>
          </Label>
          <FieldDescription>FieldDescription</FieldDescription>
        </TextField>
        <TextField showCharacterCount>
          <Label>With character count</Label>
        </TextField>
        <TextField isInvalid>
          <Label>Invalid</Label>
          <FieldError>FieldError</FieldError>
        </TextField>
        <TextField isReadOnly>
          <Label>Readonly</Label>
        </TextField>
        <TextField isDisabled>
          <Label>Disabled</Label>
        </TextField>
        <TextField type="password">
          <Label>Password</Label>
        </TextField>
        <TextField>
          <Label>CustomButton</Label>
          <Button aria-label="Custom">
            <IconStar />
          </Button>
        </TextField>
      </Flex>,
    );

    await testScreenshot("TextField states");
  },
);

test.each(testEnvironments)(
  "TextField interaction (%s)",
  async ({ testScreenshot, render, components: { TextField, Label } }) => {
    await render(
      <TextField>
        <Label>Label</Label>
      </TextField>,
    );

    const input = page.getByLocator("input");

    await testScreenshot("TextField - default");

    await userEvent.type(input, "asdf");

    await testScreenshot("TextField - text entered");
  },
);

test.each(testEnvironments)(
  "TextField edge cases (%s)",
  async ({
    testScreenshot,
    render,
    components: { Flex, TextField, Label, Button, IconStar },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <TextField value="Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius quam quas vel voluptas, ullam aliquid fugit. Voluptate harum accusantium rerum ullam modi blanditiis vitae.">
          <Label>Default</Label>
        </TextField>
        <TextField
          type="password"
          value="Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius quam quas vel voluptas, ullam aliquid fugit. Voluptate harum accusantium rerum ullam modi blanditiis vitae."
        >
          <Label>Password</Label>
        </TextField>
        <TextField value="Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius quam quas vel voluptas, ullam aliquid fugit. Voluptate harum accusantium rerum ullam modi blanditiis vitae.">
          <Label>CustomButton</Label>
          <Button aria-label="Custom">
            <IconStar />
          </Button>
        </TextField>
      </Flex>,
    );

    await testScreenshot("TextField edge cases");
  },
);
