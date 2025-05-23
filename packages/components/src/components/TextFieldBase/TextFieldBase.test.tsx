import { TextArea, TextField } from "@/index/default";
import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { createElement, type FunctionComponent } from "react";

interface TestState {
  user: UserEvent;
  elem: HTMLInputElement | HTMLTextAreaElement;
}

const makeTest = (component: FunctionComponent): TestState => {
  const { container } = render(createElement(component));
  const elem = container.querySelector("input,textarea") as
    | HTMLInputElement
    | HTMLTextAreaElement;

  if (!elem) {
    screen.debug();
    throw new Error("Could not find test element");
  }

  return {
    elem,
    user: userEvent.setup(),
  };
};

test("TextField has typed value on blur", async () => {
  const { user, elem } = makeTest(() => <TextField />);
  await user.type(elem, "test");
  expect(elem).toHaveDisplayValue("test");
  await user.tab();
  expect(elem).toHaveDisplayValue("test");
});

test("TextArea has typed value on blur", async () => {
  const { user, elem } = makeTest(() => <TextArea />);
  await user.type(elem, "test");
  expect(elem).toHaveDisplayValue("test");
  await user.tab();
  expect(elem).toHaveDisplayValue("test");
});
