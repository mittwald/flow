import { type FC, type PropsWithChildren, useId } from "react";
import { type PropsContext } from "@/lib/propsContext";
import formFieldStyles from "@/components/FormField/FormField.module.scss";
import { useFieldError } from "@/lib/hooks/useFieldError";
import { type ClassValue } from "clsx";
import type { FlowComponentName } from "@/components/propTypes";

interface FieldComponentProps {
  className?: ClassValue;
  isRequired?: boolean;
  isDisabled?: boolean;
  "aria-describedby"?: string;
}

export interface UseFieldComponent {
  FieldErrorCaptureContext: FC<PropsWithChildren>;
  FieldErrorView: FC;
  fieldPropsContext: PropsContext;
  /** For the field's outer element. */
  wrapperProps: {
    className: string;
  };
  /**
   * For what assistive technology lands on — the input, or the group of a
   * grouped control. Where the react-aria root forwards `aria-describedby` to
   * its input itself, spread it on the root together with `wrapperProps`.
   * Spread it after `rest`: it already contains the consumer's
   * `aria-describedby`, which `rest` would otherwise put back alone.
   */
  controlProps: {
    "aria-describedby"?: string;
  };
  /** The id of the error while one is rendered, without the consumer's ids. */
  renderedFieldErrorId?: string;
}

/** Joins id references, dropping empty ones. @internal */
export const joinIds = (...ids: (string | false | null | undefined)[]) =>
  ids.filter(Boolean).join(" ") || undefined;

export const useFieldComponent = (
  props: FieldComponentProps,
  component: FlowComponentName,
): UseFieldComponent => {
  const fieldErrorId = useId();
  const { FieldErrorView, FieldErrorCaptureContext, renderedFieldErrorId } =
    useFieldError({
      fieldErrorId,
      component,
    });

  // setting up the props context for all components that
  // are part of a form control
  const fieldPropsContext: PropsContext = {
    Label: {
      className: formFieldStyles.label,
      optional: !props.isRequired,
      isDisabled: !!props.isDisabled,
    },
    FieldDescription: {
      className: formFieldStyles.fieldDescription,
    },
  };

  return {
    FieldErrorView,
    FieldErrorCaptureContext,
    fieldPropsContext,
    wrapperProps: {
      className: formFieldStyles.formField,
    },
    controlProps: {
      // Reference the error only while it is rendered – an id that points to
      // nothing fails HTML validators and a11y checks.
      "aria-describedby": joinIds(
        renderedFieldErrorId,
        props["aria-describedby"],
      ),
    },
    renderedFieldErrorId,
  } as const;
};
