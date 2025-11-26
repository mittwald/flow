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
    await onSubmitFromProps?.();
  };

  return <form {...rest} ref={ref} onSubmit={onSubmit} />;
};
