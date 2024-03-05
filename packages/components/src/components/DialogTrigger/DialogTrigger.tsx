import * as Aria from "react-aria-components";
import React, { FC } from "react";

export interface DialogTriggerProps extends Aria.DialogTriggerProps {}

export const DialogTrigger: FC<DialogTriggerProps> = (props) => {
  const { children, ...rest } = props;

  return <Aria.DialogTrigger {...rest}>{children}</Aria.DialogTrigger>;
};

export default DialogTrigger;
