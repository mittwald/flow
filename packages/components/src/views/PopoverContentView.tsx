/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { PopoverContent, type PopoverContentProps } from "@/components/Popover";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const PopoverContentView: FC<PopoverContentProps> = memo((props) => {
  const View =
    useContext(viewComponentContext)["PopoverContent"] ?? PopoverContent;
  return <View {...props} />;
});
PopoverContentView.displayName = "PopoverContentView";

export default PopoverContentView;
