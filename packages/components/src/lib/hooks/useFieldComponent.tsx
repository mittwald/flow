import { type FC, type PropsWithChildren, useId } from "react";
import { type PropsContext } from "@/lib/propsContext";
import formFieldStyles from "@/components/FormField/FormField.module.scss";
import { useFieldError } from "@/lib/hooks/useFieldError";
import clsx, { type ClassValue } from "clsx";
import type { FlowComponentName } from "@/components/propTypes";

interface FieldComponentProps {
  className?: ClassValue;
  isRequired?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
  "aria-describedby"?: string;
}

export interface UseFieldComponent {
  FieldErrorCaptureContext: FC<PropsWithChildren>;
  FieldErrorView: FC;
  fieldPropsContext: PropsContext;
  fieldProps: {
    "aria-describedby"?: string;
    className?: ReturnType<typeof clsx>;
  };
}

export const useFieldComponent = (
  props: FieldComponentProps,
  component: FlowComponentName,
): UseFieldComponent => {
  const fieldErrorId = useId();
  const { FieldErrorView, FieldErrorCaptureContext } = useFieldError({
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
    fieldProps: {
      "aria-describedby": props.isInvalid
        ? fieldErrorId
        : props["aria-describedby"],
      className: clsx(formFieldStyles.formField),
    },
  } as const;
};
