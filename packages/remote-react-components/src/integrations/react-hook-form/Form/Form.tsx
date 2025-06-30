import React, { type ComponentProps } from "react";
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

  return (
    <RhfForm
      formComponent={(props: ComponentProps<typeof BaseForm>) => (
        <BaseForm {...props} />
      )}
      {...rest}
    />
  );
};

export default Form;
