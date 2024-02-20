import React, { FC, PropsWithChildren } from "react";
import * as Aria from "react-aria-components";

export const Option: FC<PropsWithChildren> = (props) => {
  return <Aria.ListBoxItem>{props.children}</Aria.ListBoxItem>;
};

export default Option;
