"use client";
import { createRemoteComponent } from "@/lib/createRemoteComponent";
import { RemoteFormElement } from "@mittwald/flow-remote-elements";
import type { ComponentProps, FC } from "react";
import { startTransition } from "react";
export { type RemoteFormElement } from "@mittwald/flow-remote-elements";

const BaseForm = createRemoteComponent("flr-form", RemoteFormElement, {
  eventProps: {
    onSubmit: { event: "submit" } as never,
  },
});

export const Form: FC<ComponentProps<typeof BaseForm>> = (props) => {
  const { action, ...rest } = props;

  const actionWithContext =
    action && typeof action === "function"
      ? (formData: FormData) => startTransition(() => action(formData))
      : action;

  return <BaseForm {...rest} action={actionWithContext} />;
};
