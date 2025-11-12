import { expect, test } from "vitest";
import { render } from "@testing-library/react";
import { useForm } from "react-hook-form";
import {
  Form,
  type FormOnSubmitHandler,
  SubmitButton,
} from "@/integrations/react-hook-form";
import { sleep } from "@/lib/promises/sleep";
import type { FC } from "react";
import { duration } from "@/components/Action/models/ActionState";
import { advanceTime, userEventFakeTimer } from "@/lib/dev/vitest";

const TestForm: FC<{ onSubmit: FormOnSubmitHandler<never> }> = (props) => {
  const form = useForm<never>({});
  return (
    <Form form={form} onSubmit={props.onSubmit}>
      <SubmitButton data-testid="submitButton" />
    </Form>
  );
};

describe("Integration RHF SubmitButton Tests", () => {
  test("renders SubmitButton with states", async () => {
    vi.useFakeTimers();
    const user = userEventFakeTimer;
    const asyncFunctionDuration = 10000;
    const form = (
      <TestForm onSubmit={async () => await sleep(asyncFunctionDuration)} />
    );
    const renderResult = render(form);

    const submitButton = renderResult.getByTestId("submitButton");

    expect(submitButton).toBeInTheDocument();
    assert(submitButton);

    await user.click(submitButton);
    await advanceTime(duration.pending - 1);
    expect(renderResult.container.querySelector("svg")).not.toBeInTheDocument();

    await advanceTime(1);
    let loadingIcon = renderResult.container.querySelector("svg");
    expect(loadingIcon).toBeInTheDocument();
    expect(loadingIcon).toHaveClass("tabler-icon-loader-2");
    assert(loadingIcon);

    await advanceTime(asyncFunctionDuration - duration.pending);
    loadingIcon = renderResult.container.querySelector("svg");
    expect(loadingIcon).toBeInTheDocument();
    expect(loadingIcon).toHaveClass("tabler-icon-check");

    await advanceTime(duration.succeeded);
    expect(renderResult.container.querySelector("svg")).not.toBeInTheDocument();
  });
});
