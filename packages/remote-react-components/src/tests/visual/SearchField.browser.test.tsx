import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import { page, userEvent } from "vitest/browser";

test.each(testEnvironments)(
  "SearchField states (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      Flex,
      SearchField,
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
        <SearchField isRequired>
          <Label>
            Default
            <ContextualHelpTrigger>
              <Button />
              <ContextualHelp />
            </ContextualHelpTrigger>
          </Label>
          <FieldDescription>FieldDescription</FieldDescription>
        </SearchField>
        <SearchField isInvalid>
          <Label>Invalid</Label>
          <FieldError>FieldError</FieldError>
        </SearchField>
        <SearchField isReadOnly>
          <Label>Readonly</Label>
        </SearchField>
        <SearchField isDisabled>
          <Label>Disabled</Label>
        </SearchField>
      </Flex>,
    );

    await testScreenshot("SearchField states");
  },
);

test.each(testEnvironments)(
  "SearchField interaction (%s)",
  async ({ testScreenshot, render, components: { SearchField, Label } }) => {
    await render(
      <SearchField>
        <Label>Label</Label>
      </SearchField>,
    );

    const input = page.getByLocator("input");

    await testScreenshot("SearchField interaction - default");

    await userEvent.type(input, "asdf");

    await testScreenshot("SearchField interaction - text entered");
  },
);
