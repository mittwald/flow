import React, { FC, PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import { Popover } from "@/components/Popover";

export const Options: FC<PropsWithChildren> = (props) => {
  return (
    <Popover>
      <Aria.ListBox>{props.children}</Aria.ListBox>
    </Popover>
  );
};

export default Options;
