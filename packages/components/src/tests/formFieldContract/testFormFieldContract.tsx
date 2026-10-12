import { FieldDescription } from "@/components/FieldDescription";
import { FieldError } from "@/components/FieldError";
import { Label } from "@/components/Label";
import labelStyles from "@/components/Label/Label.module.scss";
import { useState, type ReactElement, type ReactNode } from "react";
import { describe, expect, test, vi } from "vitest";
import { render, type RenderResult } from "vitest-browser-react";
import { userEvent, type Locator } from "vitest/browser";

/**
 * The props every form field supports. A field's own props type has to accept
 * them, so the adapter can spread them onto the component.
 */
export interface FormFieldContractProps<V> {
  children: ReactNode;
  value?: V;
  defaultValue?: V;
  onChange?: (value: unknown) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  isInvalid?: boolean;
  validationBehavior?: "aria" | "native";
  name?: string;
  form?: string;
  autoFocus?: boolean;
  ref?: (element: Element | null) => void;
}

export type FormFieldContractAspect =
  | "label"
  | "isDisabled"
  | "isReadOnly"
  | "isRequired"
  | "validationBehavior"
  | "isInvalid"
  | "description"
  | "formSubmission"
  | "uncontrolled"
  | "controlled"
  | "controlledChange"
  | "controlledHold"
  | "ref"
  | "autoFocus"
  | "focusEvents";

export interface FormFieldContractOptions<V> {
  /** Renders the field. Spread the props and render `props.children` inside. */
  render: (props: FormFieldContractProps<V>) => ReactElement;
  /** The focusable element that carries the field's ARIA state. */
  getControl: (screen: RenderResult) => Locator;
  /**
   * Two values the field can hold that submit different entries. `values[0]`
   * submits an entry.
   */
  values: [V, V];
  /**
   * What the field submits with a form for one of `values`: an entry, several
   * entries under the field's name, or `null` when it submits nothing.
   */
  toFormValue: (value: V) => FormDataEntryValue | FormDataEntryValue[] | null;
  /**
   * Changes the value from `values[0]` to `values[1]` by user interaction.
   * Passes `force` on to every interaction, so the attempt also runs against a
   * disabled or read-only field instead of waiting for it to become operable.
   */
  changeValue: (
    screen: RenderResult,
    options: { force: boolean },
  ) => Promise<void>;
  /** The inner buttons that change the value. Defaults to all buttons. */
  getValueButtons?: (screen: RenderResult) => Locator;
  /**
   * Aspects of the contract the field deliberately does not support, each with
   * the reason. Use sparingly — every entry is a gap a user can hit.
   */
  exceptions?: Partial<Record<FormFieldContractAspect, string>>;
}

const formId = "form-field-contract";
const fieldName = "field";
const afterId = "form-field-contract-after";

// An Enter in a field submits the form implicitly, which reloads the test page.
const ContractForm = (props: { children?: ReactNode }) => (
  <form id={formId} onSubmit={(event) => event.preventDefault()}>
    {props.children}
  </form>
);

const getForm = () => {
  const form = document.getElementById(formId);
  if (!(form instanceof HTMLFormElement)) {
    throw new ContractHarnessError("Contract form is not rendered");
  }
  return form;
};

const getFormEntries = () => new FormData(getForm()).getAll(fieldName);

const haveSameEntries = (a: FormDataEntryValue[], b: FormDataEntryValue[]) =>
  a.length === b.length && a.every((entry, index) => entry === b[index]);

// Lets a value that is applied after an effect or a frame arrive before a
// negative assertion reads the state.
const settle = () =>
  new Promise<void>((resolve) =>
    requestAnimationFrame(() => setTimeout(resolve)),
  );

/** A failure of the test setup, not of the aspect under test. */
class ContractHarnessError extends Error {
  override name = "ContractHarnessError";
}

// Errors a lookup, an interaction or a bug in the adapter throws. Every other
// error counts as the aspect failing — matchers registered via `expect.extend`
// (all browser matchers) throw a plain `Error`, not an `AssertionError`.
const harnessErrorNames = new Set([
  "ContractHarnessError",
  "VitestBrowserElementError",
  "TimeoutError",
  "TypeError",
  "ReferenceError",
]);

const isHarnessError = (error: unknown): boolean =>
  error instanceof Error &&
  (harnessErrorNames.has(error.name) ||
    error.message.startsWith("strict mode violation") ||
    isHarnessError(error.cause));

const isDisabledElement = (element: Element) =>
  element.matches(":disabled") ||
  element.getAttribute("aria-disabled") === "true";

const isReadOnlyElement = (element: Element) =>
  element.hasAttribute("readonly") ||
  element.getAttribute("aria-readonly") === "true";

const isRequiredElement = (element: Element) =>
  element.hasAttribute("required") ||
  element.getAttribute("aria-required") === "true";

/**
 * Checks that a form field supports every state and integration a form field
 * needs — see "Building a form field" in the package's AGENTS.md.
 */
export const testFormFieldContract = <V,>(
  name: string,
  options: FormFieldContractOptions<V>,
) => {
  const {
    getControl,
    values,
    toFormValue,
    changeValue,
    getValueButtons = (screen) => screen.getByRole("button"),
    exceptions = {},
  } = options;

  const toFormEntries = (value: V) => {
    const formValue = toFormValue(value);
    return formValue === null ? [] : [formValue].flat();
  };

  // Otherwise the submission checks compare equal lists and always pass.
  if (toFormEntries(values[0]).length === 0) {
    throw new Error(`${name}: values[0] has to submit an entry`);
  }
  if (haveSameEntries(toFormEntries(values[0]), toFormEntries(values[1]))) {
    throw new Error(`${name}: values[0] and values[1] submit the same entries`);
  }

  const field = (
    props: Partial<FormFieldContractProps<V>> = {},
    extraChildren?: ReactNode,
  ) =>
    options.render({
      name: fieldName,
      ...props,
      children: (
        <>
          <Label>Label</Label>
          {extraChildren}
        </>
      ),
    });

  const renderField = (
    props: Partial<FormFieldContractProps<V>> = {},
    extraChildren?: ReactNode,
  ) => render(<ContractForm>{field(props, extraChildren)}</ContractForm>);

  // Updates `value` from `onChange`, like react-hook-form's `Field` does.
  const StatefulField = (props: { onChange: (value: unknown) => void }) => {
    const [value, setValue] = useState(values[0]);
    return field({
      value,
      onChange: (next) => {
        props.onChange(next);
        setValue(next as V);
      },
    });
  };

  const getControlElement = async (screen: RenderResult) => {
    const control = getControl(screen);
    try {
      await expect.element(control).toBeInTheDocument();
    } catch (error) {
      throw new ContractHarnessError("Control is not rendered", {
        cause: error,
      });
    }
    return control.element();
  };

  const getButtons = (screen: RenderResult) =>
    screen.getByRole("button").elements();

  const getLabel = (screen: RenderResult) => {
    const label = screen.container.querySelector(`.${labelStyles.label}`);
    if (!label) {
      throw new ContractHarnessError("Label is not rendered");
    }
    return label;
  };

  const contractTest = (
    aspect: FormFieldContractAspect,
    title: string,
    fn: () => Promise<void>,
  ) => {
    const reason = exceptions[aspect];
    if (reason?.trim() === "") {
      throw new Error(`${name}: the "${aspect}" exception needs a reason`);
    }
    if (reason !== undefined) {
      test(`${title} (not supported: ${reason})`, async () => {
        try {
          await fn();
        } catch (error) {
          if (isHarnessError(error)) {
            throw error;
          }
          return;
        }
        throw new Error(`${name}: "${aspect}" passes, remove its exception`);
      });
    } else {
      test(title, fn);
    }
  };

  describe(`${name} form field contract`, () => {
    contractTest("label", "Label names the control", async () => {
      const screen = await renderField();

      await expect.element(getControl(screen)).toHaveAccessibleName(/Label/);
    });

    contractTest(
      "isDisabled",
      "isDisabled disables control, inner buttons and label",
      async () => {
        const onChange = vi.fn();
        const screen = await renderField({
          isDisabled: true,
          defaultValue: values[0],
          onChange,
        });
        const control = await getControlElement(screen);

        expect(isDisabledElement(control)).toBe(true);
        for (const button of getButtons(screen)) {
          expect(isDisabledElement(button)).toBe(true);
        }
        expect(getLabel(screen)).toHaveClass(labelStyles.disabled);

        await changeValue(screen, { force: true });
        await settle();
        expect(onChange).not.toHaveBeenCalled();
      },
    );

    contractTest(
      "isReadOnly",
      "isReadOnly keeps the value, the control focusable and submitted",
      async () => {
        const onChange = vi.fn();
        const screen = await renderField({
          isReadOnly: true,
          defaultValue: values[0],
          onChange,
        });
        const control = await getControlElement(screen);

        expect(isReadOnlyElement(control)).toBe(true);
        expect(isDisabledElement(control)).toBe(false);
        for (const button of getValueButtons(screen).elements()) {
          expect(isDisabledElement(button)).toBe(true);
        }
        if (!(control instanceof HTMLElement)) {
          throw new ContractHarnessError("Control is not an HTMLElement");
        }
        control.focus();
        await expect.element(getControl(screen)).toHaveFocus();

        await changeValue(screen, { force: true });
        await settle();
        expect(onChange).not.toHaveBeenCalled();
        expect(getFormEntries()).toEqual(toFormEntries(values[0]));
      },
    );

    contractTest(
      "isRequired",
      "isRequired marks the control and drops the optional marker",
      async () => {
        const optional = await renderField();
        expect(isRequiredElement(await getControlElement(optional))).toBe(
          false,
        );
        expect(
          getLabel(optional).querySelector(`.${labelStyles.optional}`),
        ).not.toBeNull();
        await optional.unmount();

        const required = await renderField({ isRequired: true });
        expect(isRequiredElement(await getControlElement(required))).toBe(true);
        expect(
          getLabel(required).querySelector(`.${labelStyles.optional}`),
        ).toBeNull();
      },
    );

    contractTest(
      "validationBehavior",
      "validationBehavior decides whether native validation blocks the form",
      async () => {
        const native = await renderField({
          isRequired: true,
          validationBehavior: "native",
        });
        expect(getForm().checkValidity()).toBe(false);
        await native.unmount();

        await renderField({ isRequired: true, validationBehavior: "aria" });
        expect(getForm().checkValidity()).toBe(true);
      },
    );

    contractTest(
      "isInvalid",
      "isInvalid marks the control and describes it with the error",
      async () => {
        const screen = await renderField(
          { isInvalid: true },
          <FieldError>Error</FieldError>,
        );
        const control = getControl(screen);

        await expect.element(control).toHaveAttribute("aria-invalid", "true");
        await expect.element(control).toHaveAccessibleDescription(/Error/);
      },
    );

    contractTest(
      "description",
      "FieldDescription describes the control",
      async () => {
        const screen = await renderField(
          {},
          <FieldDescription>Description</FieldDescription>,
        );

        await expect
          .element(getControl(screen))
          .toHaveAccessibleDescription(/Description/);
      },
    );

    contractTest(
      "formSubmission",
      "name and form submit the value with the form",
      async () => {
        const screen = await render(
          <>
            <ContractForm />
            {field({ form: formId, defaultValue: values[0] })}
          </>,
        );

        await getControlElement(screen);
        expect(getFormEntries()).toEqual(toFormEntries(values[0]));
      },
    );

    contractTest(
      "uncontrolled",
      "defaultValue sets the initial value and user changes are reported",
      async () => {
        const onChange = vi.fn();
        const screen = await renderField({
          defaultValue: values[0],
          onChange,
        });
        expect(getFormEntries()).toEqual(toFormEntries(values[0]));

        await changeValue(screen, { force: false });

        await expect.poll(getFormEntries).toEqual(toFormEntries(values[1]));
        expect(onChange).toHaveBeenLastCalledWith(values[1]);
      },
    );

    contractTest("controlled", "value controls the field", async () => {
      const onChange = vi.fn();
      const screen = await renderField({ value: values[0], onChange });
      expect(getFormEntries()).toEqual(toFormEntries(values[0]));

      await screen.rerender(
        <ContractForm>{field({ value: values[1], onChange })}</ContractForm>,
      );

      await expect.poll(getFormEntries).toEqual(toFormEntries(values[1]));
      await settle();
      expect(onChange).not.toHaveBeenCalled();
    });

    // A field that takes `value` as an initial value and syncs it in an effect
    // passes the test above, but keeps the user's change.
    contractTest(
      "controlledHold",
      "value holds until the parent takes over a user change",
      async () => {
        const onChange = vi.fn();
        const screen = await renderField({ value: values[0], onChange });
        expect(getFormEntries()).toEqual(toFormEntries(values[0]));

        await changeValue(screen, { force: false });
        await settle();

        expect(onChange).toHaveBeenLastCalledWith(values[1]);
        expect(getFormEntries()).toEqual(toFormEntries(values[0]));
      },
    );

    contractTest(
      "controlledChange",
      "user changes of a controlled field are reported",
      async () => {
        const onChange = vi.fn();
        const screen = await render(
          <ContractForm>
            <StatefulField onChange={onChange} />
          </ContractForm>,
        );
        expect(getFormEntries()).toEqual(toFormEntries(values[0]));

        await changeValue(screen, { force: false });

        await expect.poll(getFormEntries).toEqual(toFormEntries(values[1]));
        expect(onChange).toHaveBeenLastCalledWith(values[1]);
      },
    );

    contractTest("ref", "ref points at the focusable control", async () => {
      let refElement: Element | null = null;
      const screen = await renderField({
        ref: (element) => {
          refElement = element;
        },
      });

      expect(refElement).toBe(await getControlElement(screen));
    });

    contractTest("autoFocus", "autoFocus focuses the control", async () => {
      const screen = await renderField({ autoFocus: true });

      await expect.element(getControl(screen)).toHaveFocus();
    });

    contractTest(
      "focusEvents",
      "onFocus and onBlur are called for the field as a whole",
      async () => {
        const onFocus = vi.fn();
        const onBlur = vi.fn();
        const screen = await render(
          <ContractForm>
            {field({ onFocus, onBlur })}
            {/* No form control: WebKit on macOS skips buttons when tabbing, and
                another input would collide with the adapter's `getControl`. */}
            <span id={afterId} tabIndex={0} />
          </ContractForm>,
        );
        const control = await getControlElement(screen);
        const after = document.getElementById(afterId);
        if (!(control instanceof HTMLElement)) {
          throw new ContractHarnessError("Control is not an HTMLElement");
        }

        control.focus();
        await expect.poll(() => onFocus.mock.calls.length).toBe(1);

        // Tabbing through a grouped field (the segments of a date) stays in
        // the field; react-hook-form would mark it touched mid-input.
        for (let tabs = 0; document.activeElement !== after; tabs++) {
          if (tabs === 10) {
            throw new ContractHarnessError(
              "Tabbing does not reach the next element",
            );
          }
          await userEvent.tab();
          await settle();
          if (document.activeElement !== after) {
            expect(onBlur).not.toHaveBeenCalled();
          }
        }

        await expect.poll(() => onBlur.mock.calls.length).toBe(1);
        expect(onFocus).toHaveBeenCalledOnce();
      },
    );
  });
};
