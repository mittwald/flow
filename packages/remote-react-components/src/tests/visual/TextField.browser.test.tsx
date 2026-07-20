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
          <FieldDescription>FieldDescription</FieldDescription>
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
        <TextField value="A long time ago in a galaxy far, far away, the Rebel Alliance struck a decisive blow against the Galactic Empire. Rebel spies stole the secret plans to the Death Star weapon.">
          <Label>Default</Label>
        </TextField>
        <TextField
          type="password"
          value="A long time ago in a galaxy far, far away, the Rebel Alliance struck a decisive blow against the Galactic Empire. Rebel spies stole the secret plans to the Death Star weapon."
        >
          <Label>Password</Label>
        </TextField>
        <TextField value="A long time ago in a galaxy far, far away, the Rebel Alliance struck a decisive blow against the Galactic Empire. Rebel spies stole the secret plans to the Death Star weapon.">
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
