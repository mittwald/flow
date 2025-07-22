import React, { type ComponentProps, useId, useMemo } from "react";
import { Form as RhfForm } from "@mittwald/flow-react-components/react-hook-form";
import type { FormProps } from "@mittwald/flow-react-components/react-hook-form";
import type { FieldValues } from "react-hook-form";
import { createRemoteComponent } from "@/lib/createRemoteComponent";
export { type RemoteRhfFormElement } from "@mittwald/flow-remote-elements/react-hook-form";
import { RemoteRhfFormElement } from "@mittwald/flow-remote-elements/react-hook-form";

const BaseForm = createRemoteComponent("flr-rhf-form", RemoteRhfFormElement, {
  eventProps: {
    onSubmit: { event: "submit" } as never,
  },
});

export const Form = <F extends FieldValues>(props: FormProps<F>) => {
  const { ...rest } = props;
  const id = useId();

  const form = useMemo(
    () => (props: ComponentProps<typeof BaseForm>) => <BaseForm {...props} />,
    [id],
  );

  return <RhfForm key={id} {...rest} formComponent={form} />;
};

export default Form;
