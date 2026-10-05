import type { FC, ReactNode } from "react";
import type { FieldErrors } from "react-hook-form";
import { useFormContext } from "../FormContextProvider";
import FieldErrorView from "@/views/FieldErrorView";
import { useMountedFormRootErrorComponent } from "./useMountedFormRootErrorComponent";

export type FormRootErrorValue = NonNullable<FieldErrors["root"]>;

export interface FormRootErrorProps {
  /**
   * Custom content shown instead of the default alert. Rendered only while a
   * root error is set. A function receives the root error, e.g. to pick the
   * content by its `type`.
   */
  children?: ReactNode | ((error: FormRootErrorValue) => ReactNode);
}

/** @flowStatus new */
export const FormRootError: FC<FormRootErrorProps> = (props) => {
  const { children } = props;
  const form = useFormContext().form;
  useMountedFormRootErrorComponent();
  const error = form.formState.errors.root;

  if (children === undefined) {
    return <FieldErrorView renderAlert>{error?.message}</FieldErrorView>;
  }

  if (!error) {
    return null;
  }

  return <>{typeof children === "function" ? children(error) : children}</>;
};

export default FormRootError;
