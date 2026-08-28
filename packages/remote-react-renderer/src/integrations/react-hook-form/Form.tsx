import {
  type FC,
  type FormEvent,
  type PropsWithChildren,
  type Ref,
} from "react";

type FormProps = {
  onSubmit?: () => void | Promise<void>;
  ref?: Ref<HTMLFormElement>;
} & PropsWithChildren;

/**
 * ReactHookForm won't send the data over onSubmit, the form state is
 * transferred over onChange. To avoid sending unnecessary data, this RemoteForm
 * sends only the onSubmit without any formData.
 */
export const Form: FC<FormProps> = (props) => {
  const { onSubmit: onSubmitFromProps, ref, ...rest } = props;

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    /*
     * React propagates synthetic events through portals along the React tree,
     * so a Modal rendered inside a Form carries this submit up to that Form's
     * onSubmit — which would submit the surrounding form as well (#2975). The
     * remote Form's own guard cannot do this: the submit it receives is a
     * remote event without a nativeEvent.
     */
    event.stopPropagation();
    await onSubmitFromProps?.();
  };

  return <form {...rest} ref={ref} onSubmit={onSubmit} />;
};
