import {
  type FC,
  type FormEvent,
  type PropsWithChildren,
  type RefObject,
} from "react";
import React from "react";
import { useObjectRef } from "@/hooks/useObjectRef";
import { getElementFormData } from "@/components/lib/getElementFormData";

type FormProps = {
  action?: (data: FormData) => void | Promise<void>;
  onSubmit?: (data: Record<string, unknown>) => void | Promise<void>;
  ref?: RefObject<HTMLFormElement>;
} & PropsWithChildren;

export const Form: FC<FormProps> = (props) => {
  const {
    action: onActionFromProps,
    onSubmit: onSubmitFromProps,
    ref,
    ...rest
  } = props;

  const formRef = useObjectRef(ref);

  const getFormData = async (): ReturnType<typeof getElementFormData> => {
    if (!formRef.current) {
      return { formData: new FormData(), object: {} };
    }
    return getElementFormData(formRef.current);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const resolvedData = await getFormData();
    await onSubmitFromProps?.(resolvedData.object);
  };

  const onAction = async () => {
    const resolvedData = await getFormData();
    await onActionFromProps?.(resolvedData.formData);
    formRef.current?.reset();
  };

  return (
    <form
      {...rest}
      ref={formRef}
      action={onActionFromProps ? onAction : undefined}
      onSubmit={onSubmitFromProps ? onSubmit : undefined}
    />
  );
};
