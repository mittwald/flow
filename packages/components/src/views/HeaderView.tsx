/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { HeaderProps } from "@/components/Header";
import React, { useContext } from "react";
import { Header } from "@/components/Header";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const HeaderView: FC<HeaderProps> = (props) => {
  const View = useContext(viewComponentContext)["Header"] ?? Header;
  return <View {...props} />;
};

export default HeaderView;
