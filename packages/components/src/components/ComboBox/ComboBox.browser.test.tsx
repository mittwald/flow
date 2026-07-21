import { ComboBox } from "@/components/ComboBox";
import { Label } from "@/components/Label";
import { Option } from "@/components/Option";
import { render } from "vitest-browser-react";
import { userEvent } from "vitest/browser";
import { autofillAnimationName } from "./components/AutofillSelectionHandler";

const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
  window.HTMLInputElement.prototype,
  "value",
)!.set!;

/**
 * Simulates browser autofill: the value is written directly to the DOM
 * (bypassing React, like real autofill does) and the marker animation defined
 * on :autofill / :-webkit-autofill is dispatched.
 */
const simulateAutofill = (input: HTMLInputElement, value: string) => {
  nativeInputValueSetter.call(input, value);
  input.dispatchEvent(
    new AnimationEvent("animationstart", {
      animationName: autofillAnimationName,
      bubbles: true,
    }),
  );
};

const renderComboBox = async (
  props: Partial<React.ComponentProps<typeof ComboBox>> = {},
) => {
  const dom = await render(
    <ComboBox aria-label="Planet" {...props}>
      <Label>Planet</Label>
      <Option value="tatooine">Tatooine</Option>
      <Option value="naboo">Naboo</Option>
      <Option value="hoth">Hoth</Option>
    </ComboBox>,
  );
  const input = dom.getByRole("combobox").element() as HTMLInputElement;
  return { dom, input };
};

test("ComboBox selects matching option on autofill (exact match)", async () => {
  const onSelectionChange = vi.fn();
  const { input } = await renderComboBox({ onSelectionChange });

  simulateAutofill(input, "Tatooine");

  await vi.waitFor(() => {
    expect(onSelectionChange).toHaveBeenCalledWith("tatooine");
    expect(input).toHaveDisplayValue("Tatooine");
  });
});

test("ComboBox closes the menu again after committing an autofill", async () => {
  const { input } = await renderComboBox();

  simulateAutofill(input, "Tatooine");

  await vi.waitFor(() => {
    expect(input).toHaveDisplayValue("Tatooine");
  });
  await vi.waitFor(() => {
    expect(input).toHaveAttribute("aria-expanded", "false");
  });
});

test("ComboBox matches autofilled value case-insensitively and trimmed", async () => {
  const onSelectionChange = vi.fn();
  const { input } = await renderComboBox({ onSelectionChange });

  simulateAutofill(input, "  tAtOoInE ");

  await vi.waitFor(() => {
    expect(onSelectionChange).toHaveBeenCalledWith("tatooine");
  });
});

test("ComboBox matches autofilled value against option values", async () => {
  const onSelectionChange = vi.fn();
  const { input } = await renderComboBox({ onSelectionChange });

  simulateAutofill(input, "naboo");

  await vi.waitFor(() => {
    expect(onSelectionChange).toHaveBeenCalledWith("naboo");
  });
});

test("ComboBox matches unique prefix of an option text", async () => {
  const onSelectionChange = vi.fn();
  const { input } = await renderComboBox({ onSelectionChange });

  simulateAutofill(input, "Tat");

  await vi.waitFor(() => {
    expect(onSelectionChange).toHaveBeenCalledWith("tatooine");
  });
});

test("ComboBox keeps unmatched autofill value without selecting", async () => {
  const onSelectionChange = vi.fn();
  const { input } = await renderComboBox({ onSelectionChange });

  simulateAutofill(input, "Alderaan");

  await vi.waitFor(() => {
    expect(input).toHaveDisplayValue("Alderaan");
    expect(input).toHaveAttribute("aria-expanded", "false");
  });
  expect(onSelectionChange).not.toHaveBeenCalled();
});

test("ComboBox submits autofilled value in a form", async () => {
  const onSelectionChange = vi.fn();
  const dom = await render(
    <form>
      <ComboBox
        aria-label="Planet"
        name="planet"
        onSelectionChange={onSelectionChange}
      >
        <Label>Planet</Label>
        <Option value="tatooine">Tatooine</Option>
        <Option value="naboo">Naboo</Option>
      </ComboBox>
    </form>,
  );
  const input = dom.getByRole("combobox").element() as HTMLInputElement;

  simulateAutofill(input, "Tatooine");

  await vi.waitFor(() => {
    expect(onSelectionChange).toHaveBeenCalledWith("tatooine");
    const form = input.closest("form")!;
    const formData = new FormData(form);
    expect(formData.get("planet")).toBe("tatooine");
  });
});

test("ComboBox ignores autofill when a selection already exists", async () => {
  const onSelectionChange = vi.fn();
  const { input } = await renderComboBox({
    onSelectionChange,
    defaultSelectedKey: "naboo",
  });

  simulateAutofill(input, "Tatooine");

  // Give the handler time to (incorrectly) react
  await new Promise((resolve) => setTimeout(resolve, 100));
  expect(onSelectionChange).not.toHaveBeenCalled();
});

test("ComboBox ignores empty autofill values", async () => {
  const onSelectionChange = vi.fn();
  const { input } = await renderComboBox({ onSelectionChange });

  simulateAutofill(input, "");

  await new Promise((resolve) => setTimeout(resolve, 100));
  expect(onSelectionChange).not.toHaveBeenCalled();
});

test("ComboBox ignores whitespace-only autofill values", async () => {
  const onSelectionChange = vi.fn();
  const { input } = await renderComboBox({ onSelectionChange });

  simulateAutofill(input, "   ");

  await new Promise((resolve) => setTimeout(resolve, 100));
  expect(onSelectionChange).not.toHaveBeenCalled();
  expect(input).toHaveAttribute("aria-expanded", "false");
});

test("ComboBox ignores foreign animations", async () => {
  const onSelectionChange = vi.fn();
  const { input } = await renderComboBox({ onSelectionChange });

  nativeInputValueSetter.call(input, "Tatooine");
  input.dispatchEvent(
    new AnimationEvent("animationstart", {
      animationName: "some-other-animation",
      bubbles: true,
    }),
  );

  await new Promise((resolve) => setTimeout(resolve, 100));
  expect(onSelectionChange).not.toHaveBeenCalled();
});

test("ComboBox still supports regular typing and selection", async () => {
  const onSelectionChange = vi.fn();
  const { dom, input } = await renderComboBox({ onSelectionChange });

  await userEvent.type(input, "Naboo");
  await userEvent.click(dom.getByRole("option", { name: "Naboo" }));

  expect(onSelectionChange).toHaveBeenCalledWith("naboo");
});
