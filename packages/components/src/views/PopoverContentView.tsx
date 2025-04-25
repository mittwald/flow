/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { PopoverContentProps } from "@/components/Popover";
import React, { useContext } from "react";
import { PopoverContent } from "@/components/Popover";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const PopoverContentView: FC<PopoverContentProps> = (props) => {
  const View =
    useContext(viewComponentContext)["PopoverContent"] ?? PopoverContent;
  return <View {...props} />;
};

export default PopoverContentView;
