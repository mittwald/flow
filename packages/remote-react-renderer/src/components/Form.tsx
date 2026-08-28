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
    /*
     * React events bubble through portals, so a submit inside a Modal would
     * reach the Form the Modal sits in and submit it too. An action-only form
     * needs that guard as well, so the handler always runs.
     */
    event.stopPropagation();

    if (!onSubmitFromProps) {
      return;
    }
    event.preventDefault();
    await onSubmitFromProps(new FormData(event.currentTarget));
  };

  const onAction = async (formData: FormData) => {
    await onActionFromProps?.(formData);
  };

  return (
    <form
      {...rest}
      ref={ref}
      action={onActionFromProps ? onAction : undefined}
      onSubmit={onSubmit}
    />
  );
};
