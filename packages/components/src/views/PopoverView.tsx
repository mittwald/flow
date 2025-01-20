/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { Popover, type PopoverProps } from "~/components/Popover";
import { viewComponentContext } from "~/lib/viewComponentContext/viewComponentContext";

const PopoverView: FC<PopoverProps> = (props) => {
  const View = useContext(viewComponentContext)["Popover"] ?? Popover;
  return <View {...props} />;
};

export default PopoverView;
