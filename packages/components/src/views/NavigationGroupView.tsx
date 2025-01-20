/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import {
  NavigationGroup,
  type NavigationGroupProps,
} from "~/components/Navigation";
import { viewComponentContext } from "~/lib/viewComponentContext/viewComponentContext";

const NavigationGroupView: FC<NavigationGroupProps> = (props) => {
  const View =
    useContext(viewComponentContext)["NavigationGroup"] ?? NavigationGroup;
  return <View {...props} />;
};

export default NavigationGroupView;
