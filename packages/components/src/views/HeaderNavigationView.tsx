/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { HeaderNavigationProps } from "@/components/HeaderNavigation";
import React, { useContext } from "react";
import { HeaderNavigation } from "@/components/HeaderNavigation";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const HeaderNavigationView: FC<HeaderNavigationProps> = (props) => {
  const View =
    useContext(viewComponentContext)["HeaderNavigation"] ?? HeaderNavigation;
  return <View {...props} />;
};

export default HeaderNavigationView;
