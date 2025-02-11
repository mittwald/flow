/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { Navigation, type NavigationProps } from "@/components/Navigation";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const NavigationView: FC<NavigationProps> = (props) => {
  const View = useContext(viewComponentContext)["Navigation"] ?? Navigation;
  return <View {...props} />;
};

export default NavigationView;
