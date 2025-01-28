/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { PopoverContent, type PopoverContentProps } from "~/components/Popover";
import { viewComponentContext } from "~/lib/viewComponentContext/viewComponentContext";

const PopoverContentView: FC<PopoverContentProps> = (props) => {
  const View =
    useContext(viewComponentContext)["PopoverContent"] ?? PopoverContent;
  return <View {...props} />;
};

export default PopoverContentView;
