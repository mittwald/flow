import type React from "react";
import { useMemo } from "react";
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
  FieldErrorView: React.FC;
  propsContext: PropsContext;
  mergedRootClassName: string;
}

export const useFieldComponent = (
  props: FieldComponentProps,
  mergeClassName?: ClassValue,
): UseFieldComponent => {
  const { FieldErrorView, fieldErrorViewPropsContext } = useFieldError();

  // setting up the props context for all components that
  // are part of a form control
  const propsContext: PropsContext = useMemo(
    () => ({
      Label: {
        className: formFieldStyles.label,
        optional: !!props.isRequired,
        isDisabled: !!props.isDisabled,
      },
      FieldDescription: {
        className: formFieldStyles.fieldDescription,
      },
      ...fieldErrorViewPropsContext,
    }),
    [
      props.isDisabled,
      props.isRequired,
      formFieldStyles.label,
      fieldErrorViewPropsContext,
    ],
  );

  // we can't set the correct className for the root element
  // via props context - so define it here
  const mergedRootClassName = useMemo(() => {
    return clsx(formFieldStyles.formField, mergeClassName);
  }, [formFieldStyles.formField, mergeClassName]);

  // wrapping the FieldErrorView in a PropsContextProvider to ensure
  // it's always in the correct props context
  const FieldErrorViewWithPropsContext = () => (
    <PropsContextProvider props={fieldErrorViewPropsContext} clear>
      <FieldErrorView />
    </PropsContextProvider>
  );

  return {
    FieldErrorView: FieldErrorViewWithPropsContext,
    propsContext,
    mergedRootClassName,
  } as const;
};
