/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  AccordionGroup,
  type AccordionGroupProps,
} from "@/components/AccordionGroup/AccordionGroup";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const AccordionGroupView: FC<AccordionGroupProps> = memo((props) => {
  const View =
    useContext(viewComponentContext)["AccordionGroup"] ?? AccordionGroup;
  return <View {...props} />;
});
AccordionGroupView.displayName = "AccordionGroupView";

export default AccordionGroupView;
