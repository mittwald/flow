import React from "react";
import { Button as RemoteButton } from "@/auto-generated";
import { ResetButton as FlowRhfResetButton } from "@mittwald/flow-react-components/react-hook-form";
export { type RemoteButtonElementProps } from "@mittwald/flow-remote-elements";

export const ResetButton: typeof FlowRhfResetButton = (props) => {
  const { ...rest } = props;

  return (
    <FlowRhfResetButton
      {...rest}
      buttonComponent={(p) => <RemoteButton {...p} />}
    />
  );
};

export default ResetButton;
