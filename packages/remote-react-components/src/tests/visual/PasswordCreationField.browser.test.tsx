import { testEnvironments } from "@/tests/lib/environments";
import { expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";
import React from "react";

test.each(testEnvironments)(
  "PasswordCreationField states (%s)",
  async ({
    container,
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

    await expect(container).toMatchScreenshot("PasswordCreationField states");
  },
);

test.each(testEnvironments)(
  "PasswordCreationField interaction (%s)",
  async ({
    container,
    render,
    components: { PasswordCreationField, Label },
  }) => {
    await render(
      <PasswordCreationField>
        <Label>Label</Label>
      </PasswordCreationField>,
    );

    const input = page.getByLocator("input");

    await expect(container).toMatchScreenshot(
      "PasswordCreationField interaction - default",
    );

    await userEvent.type(input, "asdf");

    await expect(container).toMatchScreenshot(
      "PasswordCreationField interaction - password entered",
    );

    const showPassword = page.getByLocator('[aria-label="Show password"]');
    await showPassword.click();

    await expect(container).toMatchScreenshot(
      "PasswordCreationField interaction - show password clicked",
    );

    const generate = page.getByText("Generate");
    await generate.click();
    const hidePassword = page.getByLocator('[aria-label="Hide password"]');
    await hidePassword.click();

    await expect(container).toMatchScreenshot(
      "PasswordCreationField interaction - password generated",
    );

    const showInfo = page.getByLocator('[aria-label="More information"]');
    await showInfo.click();

    await expect(container).toMatchScreenshot(
      "PasswordCreationField interaction - show info clicked",
    );
  },
);
