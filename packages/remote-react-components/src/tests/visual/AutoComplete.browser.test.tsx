import { testEnvironments } from "@/tests/lib/environments";
import { expect, test } from "vitest";
import React from "react";
import { userEvent } from "vitest/browser";
import { page } from "vitest/browser";

test.each(testEnvironments)(
  "AutoComplete (%s)",
  async ({
    container,
    render,
    components: { Autocomplete, SearchField, Label, Option },
  }) => {
    await render(
      <Autocomplete>
        <SearchField>
          <Label>Label</Label>
        </SearchField>
        <Option value="option 1">Option 1</Option>
        <Option value="option 2">Option 2</Option>
        <Option value="option 3">Option 3</Option>
      </Autocomplete>,
    );

    await userEvent.tab();

    const input = page.getByLocator("input");
    await userEvent.type(input, "o");

    await expect(container).toMatchScreenshot("AutoComplete");
  },
);
