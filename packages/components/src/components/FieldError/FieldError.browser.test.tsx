import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { expect, test } from "vitest";
import { FieldError } from "@/components/FieldError";
import { TextField } from "@/components/TextField";
import { Label } from "@/components/Label";

const message = () => page.getByText("The name is already taken");

/*
 * The error renders nothing at all while the field is valid – it is not an
 * empty box that reserves space.
 */
test("an error without a message renders nothing", async () => {
  await render(<FieldError />);

  expect(document.body.textContent?.trim()).toBe("");
});

test("children are the message and make the field invalid", async () => {
  await render(<FieldError>The name is already taken</FieldError>);

  await expect.element(message()).toBeVisible();
});

/*
 * Inside a field the error describes the input, so it is announced with it
 * instead of being a loose piece of text. `AlertText` puts its status in front
 * of the message, which is part of what gets announced.
 */
test("inside a field the error describes the input", async () => {
  await render(
    <TextField isInvalid>
      <Label>Project name</Label>
      <FieldError>The name is already taken</FieldError>
    </TextField>,
  );

  await expect
    .element(page.getByRole("textbox"))
    .toHaveAccessibleDescription(/The name is already taken/);
});

test("a valid field shows no error even when one is written down", async () => {
  await render(
    <TextField>
      <Label>Project name</Label>
      <FieldError />
    </TextField>,
  );

  await expect.element(message()).not.toBeInTheDocument();
});

// `renderAlert` swaps the inline text for a full alert with a heading.
test("renderAlert shows the message as an alert", async () => {
  await render(<FieldError renderAlert>The name is already taken</FieldError>);

  await expect
    .element(page.getByRole("heading"))
    .toHaveTextContent("The name is already taken");
});

test("without renderAlert the message is not a heading", async () => {
  await render(<FieldError>The name is already taken</FieldError>);

  await expect.element(page.getByRole("heading")).not.toBeInTheDocument();
  await expect.element(message()).toBeVisible();
});
