import type { FC, FormEventHandler, FormHTMLAttributes } from "react";
import React, { forwardRef } from "react";

type RemoteServerAction = (payload: Record<string, unknown>) => void;
type DefaultAction = string;

type FormProps = Pick<FormHTMLAttributes<HTMLFormElement>, "action"> & {
  onSubmit?: (data: unknown) => void;
};

export const Form: FC = forwardRef<HTMLFormElement, FormProps>((props, ref) => {
  const { action: remoteAction, onSubmit, ...rest } = props;

  const hostAction = remoteAction
    ? typeof remoteAction === "string"
      ? remoteAction
      : (formData: FormData) => {
          const remoteServerAction = remoteAction as RemoteServerAction;
          const formDataObject = Object.fromEntries(
            Array.from(formData.entries()),
          );
          return remoteServerAction(formDataObject);
        }
    : undefined;

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    const formData = new FormData(e.currentTarget);
    const formDataObject = Object.fromEntries(Array.from(formData.entries()));
    e.preventDefault();
    onSubmit?.(formDataObject);
  };

  return (
    <form
      ref={ref}
      {...rest}
      action={hostAction as DefaultAction | undefined}
      onSubmit={onSubmit ? handleSubmit : undefined}
    />
  );
});
