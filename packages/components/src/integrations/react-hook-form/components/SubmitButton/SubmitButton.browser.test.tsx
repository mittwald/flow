import { expect, test } from "vitest";
import { useForm } from "react-hook-form";
import {
  Form,
  type FormOnSubmitHandler,
  SubmitButton,
} from "@/integrations/react-hook-form";
import { sleep } from "@/lib/promises/sleep";
import type { FC } from "react";
import { duration } from "@/components/Action/models/ActionState";
import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";

const TestForm: FC<{ onSubmit: FormOnSubmitHandler<never> }> = (props) => {
  const form = useForm<never>({});
  return (
    <Form form={form} onSubmit={props.onSubmit}>
      <SubmitButton data-testid="submitButton" />
    </Form>
  );
};

const ui = () => ({
  submitButton: page.getByTestId("submitButton"),
  loadingIcon: page.getByLocator(".tabler-icon-loader-2"),
  checkIcon: page.getByLocator(".tabler-icon-check"),
});

beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.restoreAllMocks();
});

describe("Integration RHF SubmitButton Tests", () => {
  test("renders SubmitButton with states", async () => {
    const asyncFunctionDuration = 10000;
    const form = (
      <TestForm onSubmit={async () => await sleep(asyncFunctionDuration)} />
    );
    const { rerender } = await render(form);

    const { checkIcon, loadingIcon, submitButton } = ui();

    await userEvent.click(submitButton);
    await vitest.advanceTimersByTimeAsync(duration.pending - 1);
    expect(loadingIcon).not.toBeInTheDocument();

    await vitest.advanceTimersByTimeAsync(1);
    await rerender(form);
    expect(loadingIcon).toBeInTheDocument();

    await vitest.advanceTimersByTimeAsync(
      asyncFunctionDuration - duration.pending,
    );
    await rerender(form);
    expect(checkIcon).toBeInTheDocument();
  });
});
