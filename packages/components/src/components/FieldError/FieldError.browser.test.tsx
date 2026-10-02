import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import { expect, test } from "vitest";
import { useContext, useState } from "react";
import { FieldErrorContext } from "react-aria-components";
import { FieldError } from "@/components/FieldError";
import styles from "@/components/FieldError/FieldError.module.scss";
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

test("a valid field without a message shows no error", async () => {
  await render(
    <TextField>
      <Label>Project name</Label>
      <FieldError />
    </TextField>,
  );

  await expect.element(page.getByRole("textbox")).toBeVisible();
  expect(document.querySelector(`.${styles.fieldError}`)).toBeNull();
});

// Children are a message of their own – the field does not have to agree.
test("children show the error inside a valid field", async () => {
  await render(
    <TextField>
      <Label>Project name</Label>
      <FieldError>The name is already taken</FieldError>
    </TextField>,
  );

  await expect
    .element(page.getByRole("textbox"))
    .toHaveAccessibleDescription(/The name is already taken/);
});

test("an error from validate describes the input", async () => {
  await render(
    <TextField
      validate={() => "The name is too short"}
      validationBehavior="aria"
    >
      <Label>Project name</Label>
      <FieldError />
    </TextField>,
  );

  await expect
    .element(page.getByRole("textbox"))
    .toHaveAccessibleDescription(/The name is too short/);
});

test("the error keeps a description passed by the consumer", async () => {
  await render(
    <>
      <span id="hint">Visible to everyone</span>
      <TextField isInvalid aria-describedby="hint">
        <Label>Project name</Label>
        <FieldError>The name is already taken</FieldError>
      </TextField>
    </>,
  );

  const input = page.getByRole("textbox");
  await expect
    .element(input)
    .toHaveAccessibleDescription(/The name is already taken/);
  await expect
    .element(input)
    .toHaveAccessibleDescription(/Visible to everyone/);
});

/*
 * For a valid field react-aria hands out one module-level `validationErrors`
 * array shared by every field. A message written into it would surface in
 * every other field of the page.
 */
test("children do not leak into other fields", async () => {
  const OtherFieldErrors = () => (
    <span data-testid="errors">
      {useContext(FieldErrorContext)?.validationErrors.length}
    </span>
  );
  const fields = (
    <>
      <TextField>
        <Label>Project name</Label>
        <FieldError>The name is already taken</FieldError>
      </TextField>
      <TextField>
        <Label>Description</Label>
        <OtherFieldErrors />
      </TextField>
    </>
  );

  const screen = await render(fields);
  await screen.rerender(fields);

  await expect.element(page.getByTestId("errors")).toHaveTextContent("0");
});

/*
 * Re-rendering the field updates the error in place. A remount would swap its
 * DOM nodes on every keystroke of a controlled field.
 */
test("the error is not remounted when the field re-renders", async () => {
  const ControlledField = () => {
    const [value, setValue] = useState("");
    return (
      <TextField value={value} onChange={setValue}>
        <Label>Project name</Label>
        <FieldError>The name is already taken</FieldError>
      </TextField>
    );
  };

  await render(<ControlledField />);
  await expect.element(message()).toBeVisible();
  const before = message().element();

  await userEvent.type(page.getByRole("textbox"), "ab");

  await expect.element(page.getByRole("textbox")).toHaveValue("ab");
  expect(message().element()).toBe(before);
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
