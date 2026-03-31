import type { FC } from "react";
import { useFormContext } from "../FormContextProvider";
import FieldErrorView from "@/views/FieldErrorView";
import { useMountedFormRootErrorComponent } from "./useMountedFormRootErrorComponent";

export const FormRootError: FC = () => {
  const form = useFormContext().form;
  useMountedFormRootErrorComponent();
  const error = form.formState.errors.root;
  return <FieldErrorView renderAlert>{error?.message}</FieldErrorView>;
};

export default FormRootError;
