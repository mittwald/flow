import React from "react";
import { Form as RhfForm } from "@mittwald/flow-react-components/react-hook-form";
import type { FormProps } from "@mittwald/flow-react-components/react-hook-form";
import type { FieldValues } from "react-hook-form";
import { Form as RemoteForm } from "@/components/Form";

export const Form = <F extends FieldValues>(props: FormProps<F>) => {
  const { ...rest } = props;

  return <RhfForm formComponent={RemoteForm} {...rest} />;
};

export default Form;
