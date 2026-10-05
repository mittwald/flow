import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { expect, test } from "vitest";
import { useContext } from "react";
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

/*
 * A field with a validation state decides whether its error shows; children
 * only give the message. The message can stay in the tree while `isInvalid`
 * switches it.
 */
test("isInvalid of the field shows and hides a written-down message", async () => {
  const Field = ({ isInvalid }: { isInvalid: boolean }) => (
    <TextField isInvalid={isInvalid}>
      <Label>Project name</Label>
      <FieldError>The name is already taken</FieldError>
    </TextField>
  );
  const screen = await render(<Field isInvalid={false} />);

  await expect.element(page.getByRole("textbox")).toBeVisible();
  await expect.element(message()).not.toBeInTheDocument();
  // A hidden error is referenced nowhere – a dangling id fails validators.
  await expect
    .element(page.getByRole("textbox"))
    .not.toHaveAttribute("aria-describedby");

  await screen.rerender(<Field isInvalid />);

  await expect
    .element(page.getByRole("textbox"))
    .toHaveAccessibleDescription(/The name is already taken/);

  await screen.rerender(<Field isInvalid={false} />);

  await expect.element(message()).not.toBeInTheDocument();
  await expect
    .element(page.getByRole("textbox"))
    .not.toHaveAttribute("aria-describedby");
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
