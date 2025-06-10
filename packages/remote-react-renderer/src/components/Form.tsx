import { getElementFormData } from "@/components/lib/getElementFormData";
import {
  type FC,
  type FormEvent,
  type PropsWithChildren,
  type RefObject,
} from "react";

type FormProps = {
  action?: (data: FormData) => void | Promise<void>;
  onSubmit?: (data: FormData) => void;
  ref?: RefObject<HTMLFormElement>;
} & PropsWithChildren;

export const Form: FC<FormProps> = (props) => {
  const {
    action: onActionFromProps,
    onSubmit: onSubmitFromProps,
    ...rest
  } = props;

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!onSubmitFromProps) {
      return;
    }
    const resolvedData = await getElementFormData(
      new FormData(event.currentTarget),
    );
    onSubmitFromProps(resolvedData);
  };

  const onAction = async (formData: FormData) => {
    if (!onActionFromProps) {
      return;
    }
    const resolvedData = await getElementFormData(formData);
    await onActionFromProps?.(resolvedData);
  };

  return (
    <form
      {...rest}
      action={onActionFromProps ? onAction : undefined}
      onSubmit={onSubmitFromProps ? onSubmit : undefined}
    />
  );
};
