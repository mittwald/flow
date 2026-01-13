/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  Accordion,
  type AccordionProps,
} from "@/components/Accordion/Accordion";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const AccordionView: FC<AccordionProps> = memo((props) => {
  const View = useContext(viewComponentContext)["Accordion"] ?? Accordion;
  return <View {...props} />;
});
AccordionView.displayName = "AccordionView";

export default AccordionView;
