import { FieldDescription } from "@/components/FieldDescription";
import { FieldError } from "@/components/FieldError";
import { Label } from "@/components/Label";
import labelStyles from "@/components/Label/Label.module.scss";
import type { ReactElement, ReactNode } from "react";
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
  /** The value the field submits with a form, for one of `values`. */
  toFormValue: (value: V) => string;
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

const getFormValue = () => {
  const form = document.getElementById(formId);
  if (!(form instanceof HTMLFormElement)) {
    throw new Error("Contract form is not rendered");
  }
  return new FormData(form).get(fieldName);
};

const getForm = () => {
  const form = document.getElementById(formId);
  if (!(form instanceof HTMLFormElement)) {
    throw new Error("Contract form is not rendered");
  }
  return form;
};

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

  const renderField = (
    props: Partial<FormFieldContractProps<V>> = {},
    extraChildren?: ReactNode,
  ) =>
    render(
      <form id={formId}>
        {options.render({
          name: fieldName,
          ...props,
          children: (
            <>
              <Label>Label</Label>
              {extraChildren}
            </>
          ),
        })}
      </form>,
    );

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
    if (reason) {
      test.skip(`${title} (not supported: ${reason})`, fn);
    } else {
      test(title, fn);
    }
  };

  describe(`${name} form field contract`, () => {
    aspect("isDisabled", "isDisabled disables control and label", async () => {
      const screen = await renderField({ isDisabled: true });
      const control = getControl(screen).element();

      expect(isDisabledElement(control)).toBe(true);
      expect(getLabel(screen)).toHaveClass(labelStyles.disabled);
    });

    aspect("isReadOnly", "isReadOnly makes the control read-only", async () => {
      const screen = await renderField({ isReadOnly: true });

      expect(isReadOnlyElement(getControl(screen).element())).toBe(true);
    });

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
            {options.render({
              name: fieldName,
              form: formId,
              defaultValue: values[0],
              children: <Label>Label</Label>,
            })}
          </>,
        );

        await expect.element(getControl(screen)).toBeInTheDocument();
        expect(getFormValue()).toBe(toFormValue(values[0]));
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
        expect(getFormValue()).toBe(toFormValue(values[0]));

        await changeValue(screen);

        expect(onChange).toHaveBeenCalled();
        await expect.poll(getFormValue).toBe(toFormValue(values[1]));
      },
    );

    aspect("controlled", "value controls the field", async () => {
      const onChange = vi.fn();
      const screen = await renderField({ value: values[0], onChange });
      expect(getFormValue()).toBe(toFormValue(values[0]));

      await screen.rerender(
        <form id={formId}>
          {options.render({
            name: fieldName,
            value: values[1],
            onChange,
            children: <Label>Label</Label>,
          })}
        </form>,
      );

      await expect.poll(getFormValue).toBe(toFormValue(values[1]));
      expect(onChange).not.toHaveBeenCalled();
    });

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
