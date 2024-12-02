import type { FC, FormHTMLAttributes } from "react";
import React, { forwardRef } from "react";

type RemoteServerAction = (payload: Record<string, unknown>) => void;
type DefaultAction = string;

type FormProps = Pick<
  FormHTMLAttributes<HTMLFormElement>,
  "onSubmit" | "action"
>;

export const Form: FC = forwardRef<HTMLFormElement, FormProps>((props, ref) => {
  const { action: remoteAction, ...rest } = props;

  const hostAction = remoteAction
    ? typeof remoteAction === "string"
      ? remoteAction
      : (payload: FormData) => {
          const remoteServerAction = remoteAction as RemoteServerAction;
          remoteServerAction(Object.fromEntries(payload.entries()));
        }
    : undefined;

  return (
    <form
      ref={ref}
      {...rest}
      action={hostAction as DefaultAction | undefined}
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit?.(e);
      }}
    />
  );
});
