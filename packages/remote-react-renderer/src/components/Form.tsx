import {
  type FC,
  type FormEvent,
  type FormHTMLAttributes,
  type PropsWithChildren,
} from "react";
import React, { forwardRef } from "react";
import {
  getFormDataObject,
  getFormDataObjectFromEvent,
} from "@/components/lib/getFormDataObject";

type FormProps = Pick<FormHTMLAttributes<HTMLFormElement>, "action"> & {
  onSubmit?: (data: Record<string, unknown>) => void;
} & PropsWithChildren;

export const Form: FC = forwardRef<HTMLFormElement, FormProps>((props, ref) => {
  const {
    action: actionFromProps,
    onSubmit: onSubmitFromProps,
    ...rest
  } = props;

  const action =
    typeof actionFromProps === "function"
      ? (formData: FormData) =>
          actionFromProps(getFormDataObject(formData) as unknown as FormData)
      : actionFromProps;

  const onSubmit = onSubmitFromProps
    ? (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmitFromProps(getFormDataObjectFromEvent(e));
      }
    : undefined;

  return <form ref={ref} {...rest} action={action} onSubmit={onSubmit} />;
});
