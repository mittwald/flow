import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import { page, userEvent } from "vitest/browser";

test.each(testEnvironments)(
  "PasswordCreationField states (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      Flex,
      PasswordCreationField,
      Label,
      FieldError,
      IconStar,
      Button,
    },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <PasswordCreationField isRequired>
          <Label>Default</Label>
          <Button>
            <IconStar />
          </Button>
        </PasswordCreationField>
        <PasswordCreationField isInvalid>
          <Label>Invalid</Label>
          <FieldError>FieldError</FieldError>
        </PasswordCreationField>
        <PasswordCreationField isReadOnly>
          <Label>Readonly</Label>
        </PasswordCreationField>
        <PasswordCreationField isDisabled>
          <Label>Disabled</Label>
        </PasswordCreationField>
      </Flex>,
    );

    await testScreenshot("PasswordCreationField states");
  },
);

test.each(testEnvironments)(
  "PasswordCreationField interaction (%s)",
  async ({
    testScreenshot,
    render,
    components: { PasswordCreationField, Label },
  }) => {
    await render(
      <PasswordCreationField>
        <Label>Label</Label>
      </PasswordCreationField>,
    );

    const input = page.getByLocator("input");

    await testScreenshot("PasswordCreationField interaction - default");

    await userEvent.type(input, "asdf");

    await testScreenshot(
      "PasswordCreationField interaction - password entered",
    );

    const showPassword = page.getByLocator('[aria-label="Show password"]');
    await showPassword.click();

    await testScreenshot(
      "PasswordCreationField interaction - show password clicked",
    );

    const generate = page.getByText("Generate");
    await generate.click();
    const hidePassword = page.getByLocator('[aria-label="Hide password"]');
    await hidePassword.click();

    await testScreenshot(
      "PasswordCreationField interaction - password generated",
    );

    const showInfo = page.getByLocator(
      '[aria-label="More information about your password requirements"]',
    );
    await showInfo.click();

    await testScreenshot(
      "PasswordCreationField interaction - show info clicked",
    );
  },
);

/*
 * An error from outside the policy (a server error) turns the bar danger like
 * the field, even for a password the policy rates strong.
 */
test.each(testEnvironments)(
  "PasswordCreationField invalid strong password (%s)",
  async ({
    testScreenshot,
    render,
    components: { PasswordCreationField, Label, FieldError },
  }) => {
    await render(
      <PasswordCreationField isInvalid defaultValue="Imperial-March-1977!">
        <Label>Password</Label>
        <FieldError>This password was already used</FieldError>
      </PasswordCreationField>,
    );

    await testScreenshot("PasswordCreationField invalid strong password");
  },
);

test.each(testEnvironments)(
  "PasswordCreationField edge cases (%s)",
  async ({
    testScreenshot,
    render,
    components: { PasswordCreationField, Label, ColumnLayout },
  }) => {
    await render(
      <ColumnLayout l={[1, 1, 1, 1, 1]}>
        <PasswordCreationField isRequired>
          <Label>Default</Label>
        </PasswordCreationField>
      </ColumnLayout>,
    );

    await testScreenshot("PasswordCreationField edge cases");
  },
);
