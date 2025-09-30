/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  HeaderNavigation,
  type HeaderNavigationProps,
} from "@/components/HeaderNavigation";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const HeaderNavigationView: FC<HeaderNavigationProps> = memo((props) => {
  const View =
    useContext(viewComponentContext)["HeaderNavigation"] ?? HeaderNavigation;
  return <View {...props} />;
});
HeaderNavigationView.displayName = "HeaderNavigationView";

export default HeaderNavigationView;
