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
     * React propagates synthetic events through portals along the React tree,
     * so a Modal rendered inside a Form carries this submit up to that Form's
     * onSubmit — which would submit the surrounding form as well (#2975). This
     * runs for an action-only form too, hence the handler is always attached.
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
