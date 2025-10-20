import type { FC, PropsWithChildren } from "react";
import React from "react";
import { type PropsContext, PropsContextProvider } from "@/lib/propsContext";
import formFieldStyles from "@/components/FormField/FormField.module.scss";
import { useFieldError } from "@/lib/hooks/useFieldError";
import clsx, { type ClassValue } from "clsx";

interface FieldComponentProps {
  className?: ClassValue;
  isRequired?: boolean;
  isDisabled?: boolean;
}

export interface UseFieldComponent {
  FieldErrorResetContext: FC<PropsWithChildren>;
  FieldErrorView: FC;
  fieldPropsContext: PropsContext;
  fieldProps: {
    className?: ReturnType<typeof clsx>;
  };
}

export const useFieldComponent = (
  props: FieldComponentProps,
): UseFieldComponent => {
  const { FieldErrorView, fieldErrorViewPropsContext, FieldErrorResetContext } =
    useFieldError();

  // setting up the props context for all components that
  // are part of a form control
  const fieldPropsContext: PropsContext = {
    Label: {
      className: formFieldStyles.label,
      optional: !props.isRequired,
      isDisabled: props.isDisabled,
    },
    FieldDescription: {
      className: formFieldStyles.fieldDescription,
    },
    ...fieldErrorViewPropsContext,
  };

  // wrapping the FieldErrorView in a PropsContextProvider to ensure
  // it's always in the correct props context
  const FieldErrorViewWithPropsContext = () => (
    <PropsContextProvider props={fieldErrorViewPropsContext}>
      <FieldErrorView />
    </PropsContextProvider>
  );

  return {
    FieldErrorResetContext,
    FieldErrorView: FieldErrorViewWithPropsContext,
    fieldPropsContext,
    fieldProps: {
      className: clsx(formFieldStyles.formField),
    },
  } as const;
};
