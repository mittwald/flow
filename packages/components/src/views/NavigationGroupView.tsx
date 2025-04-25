/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { NavigationGroupProps } from "@/components/Navigation";
import React, { useContext } from "react";
import { NavigationGroup } from "@/components/Navigation";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const NavigationGroupView: FC<NavigationGroupProps> = (props) => {
  const View =
    useContext(viewComponentContext)["NavigationGroup"] ?? NavigationGroup;
  return <View {...props} />;
};

export default NavigationGroupView;
