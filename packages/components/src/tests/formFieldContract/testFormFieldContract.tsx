import { FieldDescription } from "@/components/FieldDescription";
import { FieldError } from "@/components/FieldError";
import { Label } from "@/components/Label";
import labelStyles from "@/components/Label/Label.module.scss";
import { useState, type ReactElement, type ReactNode } from "react";
import { describe, expect, test, vi } from "vitest";
import { render, type RenderResult } from "vitest-browser-react";
import type { Locator } from "vitest/browser";

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
  | "isDisabled"
  | "isReadOnly"
  | "isRequired"
  | "validationBehavior"
  | "isInvalid"
  | "description"
  | "formSubmission"
  | "uncontrolled"
  | "controlled"
  | "ref"
  | "autoFocus"
  | "focusEvents";

export interface FormFieldContractOptions<V> {
  /** Renders the field. Spread the props and render `props.children` inside. */
  render: (props: FormFieldContractProps<V>) => ReactElement;
  /** The focusable element that carries the field's ARIA state. */
  getControl: (screen: RenderResult) => Locator;
  /** Two distinct values the field can hold. */
  values: [V, V];
  /**
   * What the field submits with a form for one of `values`: an entry, several
   * entries under the field's name, or `null` when it submits nothing.
   */
  toFormValue: (value: V) => FormDataEntryValue | FormDataEntryValue[] | null;
  /** Changes the value from `values[0]` to `values[1]` by user interaction. */
  changeValue: (screen: RenderResult) => Promise<void>;
  /**
   * Aspects of the contract the field deliberately does not support, each with
   * the reason. Use sparingly — every entry is a gap a user can hit.
   */
  exceptions?: Partial<Record<FormFieldContractAspect, string>>;
}

const formId = "form-field-contract";
const fieldName = "field";

const getForm = () => {
  const form = document.getElementById(formId);
  if (!(form instanceof HTMLFormElement)) {
    throw new Error("Contract form is not rendered");
  }
  return form;
};

const getFormEntries = () => new FormData(getForm()).getAll(fieldName);

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
    exceptions = {},
  } = options;

  const toFormEntries = (value: V) => {
    const formValue = toFormValue(value);
    return formValue === null ? [] : [formValue].flat();
  };

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
  ) => render(<form id={formId}>{field(props, extraChildren)}</form>);

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

  const getButtons = (screen: RenderResult) =>
    Array.from(screen.container.querySelectorAll("button"));

  const getLabel = (screen: RenderResult) => {
    const label = screen.container.querySelector(`.${labelStyles.label}`);
    if (!label) {
      throw new Error("Label is not rendered");
    }
    return label;
  };

  const aspect = (
    aspect: FormFieldContractAspect,
    title: string,
    fn: () => Promise<void>,
  ) => {
    const reason = exceptions[aspect];
    if (reason !== undefined) {
      // Fails the run once the aspect passes, so a fixed gap drops its entry.
      test.fails(`${title} (not supported: ${reason})`, fn);
    } else {
      test(title, fn);
    }
  };

  describe(`${name} form field contract`, () => {
    aspect(
      "isDisabled",
      "isDisabled disables control, inner buttons and label",
      async () => {
        const screen = await renderField({
          isDisabled: true,
          defaultValue: values[0],
        });
        const control = getControl(screen).element();

        expect(isDisabledElement(control)).toBe(true);
        for (const button of getButtons(screen)) {
          expect(isDisabledElement(button)).toBe(true);
        }
        expect(getLabel(screen)).toHaveClass(labelStyles.disabled);
      },
    );

    aspect(
      "isReadOnly",
      "isReadOnly makes the control read-only and turns inner buttons off",
      async () => {
        const screen = await renderField({
          isReadOnly: true,
          defaultValue: values[0],
        });
        const control = getControl(screen).element();

        expect(isReadOnlyElement(control)).toBe(true);
        expect(isDisabledElement(control)).toBe(false);
        for (const button of getButtons(screen)) {
          expect(isDisabledElement(button)).toBe(true);
        }
        expect(getFormEntries()).toEqual(toFormEntries(values[0]));
      },
    );

    aspect(
      "isRequired",
      "isRequired marks the control and drops the optional marker",
      async () => {
        const optional = await renderField();
        expect(isRequiredElement(getControl(optional).element())).toBe(false);
        expect(
          getLabel(optional).querySelector(`.${labelStyles.optional}`),
        ).not.toBeNull();
        await optional.unmount();

        const required = await renderField({ isRequired: true });
        expect(isRequiredElement(getControl(required).element())).toBe(true);
        expect(
          getLabel(required).querySelector(`.${labelStyles.optional}`),
        ).toBeNull();
      },
    );

    aspect(
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

    aspect(
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

    aspect(
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

    aspect(
      "formSubmission",
      "name and form submit the value with the form",
      async () => {
        const screen = await render(
          <>
            <form id={formId} />
            {field({ form: formId, defaultValue: values[0] })}
          </>,
        );

        await expect.element(getControl(screen)).toBeInTheDocument();
        expect(getFormEntries()).toEqual(toFormEntries(values[0]));
      },
    );

    aspect(
      "uncontrolled",
      "defaultValue sets the initial value and user changes are reported",
      async () => {
        const onChange = vi.fn();
        const screen = await renderField({
          defaultValue: values[0],
          onChange,
        });
        expect(getFormEntries()).toEqual(toFormEntries(values[0]));

        await changeValue(screen);

        await expect.poll(getFormEntries).toEqual(toFormEntries(values[1]));
        expect(onChange).toHaveBeenLastCalledWith(values[1]);
      },
    );

    aspect("controlled", "value controls the field", async () => {
      const onChange = vi.fn();
      const screen = await renderField({ value: values[0], onChange });
      expect(getFormEntries()).toEqual(toFormEntries(values[0]));

      await screen.rerender(
        <form id={formId}>{field({ value: values[1], onChange })}</form>,
      );

      await expect.poll(getFormEntries).toEqual(toFormEntries(values[1]));
      expect(onChange).not.toHaveBeenCalled();
    });

    aspect(
      "controlled",
      "user changes of a controlled field are reported",
      async () => {
        const onChange = vi.fn();
        const screen = await render(
          <form id={formId}>
            <StatefulField onChange={onChange} />
          </form>,
        );
        expect(getFormEntries()).toEqual(toFormEntries(values[0]));

        await changeValue(screen);

        await expect.poll(getFormEntries).toEqual(toFormEntries(values[1]));
        expect(onChange).toHaveBeenLastCalledWith(values[1]);
      },
    );

    aspect("ref", "ref points at the focusable control", async () => {
      let refElement: Element | null = null;
      const screen = await renderField({
        ref: (element) => {
          refElement = element;
        },
      });

      expect(refElement).toBe(getControl(screen).element());
    });

    aspect("autoFocus", "autoFocus focuses the control", async () => {
      const screen = await renderField({ autoFocus: true });

      await expect.element(getControl(screen)).toHaveFocus();
    });

    aspect("focusEvents", "onFocus and onBlur are called", async () => {
      const onFocus = vi.fn();
      const onBlur = vi.fn();
      const screen = await renderField({ onFocus, onBlur });
      const control = getControl(screen).element();
      if (!(control instanceof HTMLElement)) {
        throw new Error("Control is not an HTMLElement");
      }

      control.focus();
      await expect.poll(() => onFocus.mock.calls.length).toBe(1);

      control.blur();
      await expect.poll(() => onBlur.mock.calls.length).toBe(1);
    });
  });
};
