import React from "react";
import { Button as RemoteButton } from "@/auto-generated";
import { SubmitButton as FlowRhfSubmitButton } from "@mittwald/flow-react-components/react-hook-form";
export { type RemoteButtonElementProps } from "@mittwald/flow-remote-elements";

export const SubmitButton: typeof FlowRhfSubmitButton = (props) => {
  const { ...rest } = props;

  return (
    <FlowRhfSubmitButton
      {...rest}
      buttonComponent={(p) => <RemoteButton {...p} />}
    />
  );
};

export default SubmitButton;
