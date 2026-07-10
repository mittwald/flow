/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  HorizontalNavigation,
  type HorizontalNavigationProps,
} from "@/components/HorizontalNavigation/HorizontalNavigation";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const HorizontalNavigationView: FC<HorizontalNavigationProps> = memo(
  (props) => {
    const View =
      useContext(viewComponentContext)["HorizontalNavigation"] ??
      HorizontalNavigation;
    return <View {...props} />;
  },
);
HorizontalNavigationView.displayName = "HorizontalNavigationView";

export default HorizontalNavigationView;
