import React, { FC, PropsWithChildren } from "react";
import * as Aria from "react-aria-components";

export const Options: FC<PropsWithChildren> = (props) => {
  return (
    <Aria.Popover>
      <Aria.ListBox>{props.children}</Aria.ListBox>
    </Aria.Popover>
  );
};

export default Options;
