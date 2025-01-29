import * as Aria from "react-aria-components";
import type { ComponentProps, FC } from "react";

export type DialogTriggerProps = ComponentProps<typeof Aria.DialogTrigger>;

/** @flr-generate all */
export const DialogTrigger: FC<DialogTriggerProps> = (props) => {
  return <Aria.DialogTrigger {...props} />;
};

export default DialogTrigger;
