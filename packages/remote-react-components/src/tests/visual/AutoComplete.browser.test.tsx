import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import { userEvent, page } from "vitest/browser";

test.each(testEnvironments)(
  "AutoComplete (%s)",
  async ({
    testScreenshot,
    render,
    components: { Autocomplete, SearchField, Label, Option },
  }) => {
    await render(
      <Autocomplete>
        <SearchField>
          <Label>Label</Label>
        </SearchField>
        <Option data-testid="option" value="option 1">
          Option 1
        </Option>
        <Option value="option 2">Option 2</Option>
        <Option value="option 3">Option 3</Option>
      </Autocomplete>,
    );

    const input = page.getByLocator("input");
    const option = page.getByTestId("option");

    await testScreenshot("AutoComplete - default");

    await userEvent.type(input, "o");

    await testScreenshot("AutoComplete - options visible");

    await option.click();

    await testScreenshot("AutoComplete - option selected");
  },
);
