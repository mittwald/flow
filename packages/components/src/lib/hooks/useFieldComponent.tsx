import type { FC, PropsWithChildren } from "react";
import { type PropsContext } from "@/lib/propsContext";
import formFieldStyles from "@/components/FormField/FormField.module.scss";
import { useFieldError } from "@/lib/hooks/useFieldError";
import clsx, { type ClassValue } from "clsx";

interface FieldComponentProps {
  className?: ClassValue;
  isRequired?: boolean;
  isDisabled?: boolean;
}

export interface UseFieldComponent {
  FieldErrorCaptureContext: FC<PropsWithChildren>;
  FieldErrorView: FC;
  fieldPropsContext: PropsContext;
  fieldProps: {
    className?: ReturnType<typeof clsx>;
  };
}

export const useFieldComponent = (
  props: FieldComponentProps,
): UseFieldComponent => {
  const { FieldErrorView, FieldErrorCaptureContext } = useFieldError();

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
      className: clsx(formFieldStyles.formField),
    },
  } as const;
};
