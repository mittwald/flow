import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import { expect, test } from "vitest";
import { Label } from "@/components/Label";
import { TextField } from "@/components/TextField";
import { NumberField } from "@/components/NumberField";
import { Select } from "@/components/Select";
import { Option } from "@/components/Option";
import { PasswordCreationField } from "@/components/PasswordCreationField";
import { Button } from "@/components/Button";
import {
  ContextualHelp,
  ContextualHelpTrigger,
} from "@/components/ContextualHelp";
import { Text } from "@/components/Text";

const contextualHelp = (
  <ContextualHelpTrigger>
    <Button />
    <ContextualHelp>
      <Text>Help</Text>
    </ContextualHelp>
  </ContextualHelpTrigger>
);

/*
 * Fields point `aria-labelledby` at the label, and the name computation walks
 * its whole subtree. Buttons tunnelled into the label must not end up in the
 * field's name (#3235).
 */
test("the contextual help stays out of the field's name", async () => {
  await render(
    <TextField>
      <Label>
        Name
        {contextualHelp}
      </Label>
    </TextField>,
  );

  await expect
    .element(
      page.getByRole("textbox", { name: "Name (optional)", exact: true }),
    )
    .toBeInTheDocument();
  await expect
    .element(
      page.getByRole("button", { name: "More information", exact: true }),
    )
    .toBeInTheDocument();
});

test("a button in the label stays out of the field's name", async () => {
  await render(
    <TextField isRequired>
      <Label>
        Name
        <Button>Fill in</Button>
      </Label>
    </TextField>,
  );

  await expect
    .element(page.getByRole("textbox", { name: "Name", exact: true }))
    .toBeInTheDocument();
});

test("the satellite buttons of a field are named without the label's buttons", async () => {
  await render(
    <NumberField>
      <Label>
        Age
        {contextualHelp}
      </Label>
    </NumberField>,
  );

  await expect
    .element(page.getByRole("textbox", { name: "Age (optional)", exact: true }))
    .toBeInTheDocument();
  await expect
    .element(
      page.getByRole("button", {
        name: "Increase Age (optional)",
        exact: true,
      }),
    )
    .toBeInTheDocument();
});

test("the select trigger is named without the label's buttons", async () => {
  await render(
    <Select>
      <Label>
        Starship
        {contextualHelp}
      </Label>
      <Option>X-Wing</Option>
    </Select>,
  );

  await expect
    .element(
      page.getByRole("button", {
        name: /^Select an item Starship \(optional\)$/,
      }),
    )
    .toBeInTheDocument();
});

test("the password field is named without its label buttons", async () => {
  await render(
    <PasswordCreationField>
      <Label>Password</Label>
    </PasswordCreationField>,
  );

  await expect
    .element(
      page.getByRole("textbox", { name: "Password (optional)", exact: true }),
    )
    .toBeInTheDocument();
});

test("clicking the label text still focuses the field", async () => {
  await render(
    <TextField isRequired>
      <Label>
        Name
        {contextualHelp}
      </Label>
    </TextField>,
  );

  await userEvent.click(page.getByText("Name", { exact: true }));

  await expect.element(page.getByRole("textbox")).toHaveFocus();
});
