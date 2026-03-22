import { type FC, type PropsWithChildren, useMemo } from "react";
import { type PropsContext } from "@/lib/propsContext";
import formFieldStyles from "@/components/FormField/FormField.module.scss";
import { useFieldError } from "@/lib/hooks/useFieldError";
import clsx, { type ClassValue } from "clsx";

type FieldComponentProps<P = unknown> = P & {
  className?: ClassValue;
  isRequired?: boolean;
  isDisabled?: boolean;
};

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
  const fieldPropsContext: PropsContext = useMemo(
    () => ({
      Label: {
        className: formFieldStyles.label,
        optional: !props.isRequired,
        isDisabled: !!props.isDisabled,
      },
      FieldDescription: {
        className: formFieldStyles.fieldDescription,
      },
    }),
    [
      formFieldStyles.fieldDescription,
      formFieldStyles.label,
      props.isRequired,
      props.isDisabled,
    ],
  );

  const fieldProps = useMemo(
    () => ({
      className: clsx(formFieldStyles.formField),
    }),
    [formFieldStyles.formField],
  );

  return {
    FieldErrorView,
    FieldErrorCaptureContext,
    fieldPropsContext,
    fieldProps,
  } as const;
};
