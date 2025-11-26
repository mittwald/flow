import {
  type FC,
  type FormEvent,
  type PropsWithChildren,
  type Ref,
} from "react";
import { prepareFormData } from "@/components/lib/prepareFormData";

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
    const resolvedData = await prepareFormData(
      new FormData(event.currentTarget),
    );
    await onSubmitFromProps?.(resolvedData);
  };

  const onAction = async (formData: FormData) => {
    const resolvedFormData = await prepareFormData(formData);
    await onActionFromProps?.(resolvedFormData);
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
