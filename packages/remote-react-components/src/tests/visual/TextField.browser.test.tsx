import { testEnvironments } from "@/tests/lib/environments";
import { expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";

test.each(testEnvironments)(
  "TextField states (%s)",
  async ({
    container,
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
      </Flex>,
    );

    await expect(container).toMatchScreenshot("TextField states");
  },
);

test.each(testEnvironments)(
  "TextField interaction (%s)",
  async ({ container, render, components: { TextField, Label } }) => {
    await render(
      <TextField>
        <Label>Label</Label>
      </TextField>,
    );

    const input = page.getByLocator("input");

    await expect(container).toMatchScreenshot("TextField - default");

    await userEvent.type(input, "asdf");

    await expect(container).toMatchScreenshot("TextField - text entered");
  },
);
