/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import {
  HeaderNavigation,
  type HeaderNavigationProps,
} from "~/components/HeaderNavigation";
import { viewComponentContext } from "~/lib/viewComponentContext/viewComponentContext";

const HeaderNavigationView: FC<HeaderNavigationProps> = (props) => {
  const View =
    useContext(viewComponentContext)["HeaderNavigation"] ?? HeaderNavigation;
  return <View {...props} />;
};

export default HeaderNavigationView;
