import type { FC, FormEvent, FormHTMLAttributes } from "react";
import React, { forwardRef } from "react";

type FormProps = Pick<FormHTMLAttributes<HTMLFormElement>, "action"> & {
  onSubmit?: (data: Record<string, unknown>) => void;
};

const getFormDataObject = (formData: FormData): Record<string, unknown> =>
  Object.fromEntries(Array.from(formData.entries()));

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
        onSubmitFromProps(getFormDataObject(new FormData(e.currentTarget)));
      }
    : undefined;

  return <form ref={ref} {...rest} action={action} onSubmit={onSubmit} />;
});
