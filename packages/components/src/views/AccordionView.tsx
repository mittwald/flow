/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { AccordionProps } from "@/components/Accordion";
import React, { useContext } from "react";
import { Accordion } from "@/components/Accordion";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const AccordionView: FC<AccordionProps> = (props) => {
  const View = useContext(viewComponentContext)["Accordion"] ?? Accordion;
  return <View {...props} />;
};

export default AccordionView;
