import {
  type FC,
  type FormEvent,
  type PropsWithChildren,
  type Ref,
} from "react";

type FormProps = {
  action?: (data: FormData) => void | Promise<void>;
  onSubmit?: (data: FormData) => void | Promise<void>;
  ref?: Ref<HTMLFormElement>;
} & PropsWithChildren;

export const Form: FC<FormProps> = (props) => {
  const {
    action: onActionFromProps,
    onSubmit: onSubmitFromProps,
    ref,
    ...rest
  } = props;

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmitFromProps?.(new FormData(event.currentTarget));
  };

  const onAction = async (formData: FormData) => {
    await onActionFromProps?.(formData);
  };

  return (
    <form
      {...rest}
      ref={ref}
      action={onActionFromProps ? onAction : undefined}
      onSubmit={onSubmitFromProps ? onSubmit : undefined}
    />
  );
};
