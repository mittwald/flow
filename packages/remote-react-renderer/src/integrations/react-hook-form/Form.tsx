import {
  type FC,
  type FormEvent,
  type PropsWithChildren,
  type RefObject,
} from "react";
import React from "react";

type FormProps = {
  onSubmit?: () => void | Promise<void>;
  ref?: RefObject<HTMLFormElement>;
} & PropsWithChildren;

export const Form: FC<FormProps> = (props) => {
  const { onSubmit: onSubmitFromProps, ref, ...rest } = props;

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmitFromProps?.();
  };

  return <form {...rest} ref={ref} onSubmit={onSubmit} />;
};
