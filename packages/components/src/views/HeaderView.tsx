/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { Header, type HeaderProps } from "@/components/Header/Header";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const HeaderView: FC<HeaderProps> = memo((props) => {
  const View = useContext(viewComponentContext)["Header"] ?? Header;
  return <View {...props} />;
});
HeaderView.displayName = "HeaderView";

export default HeaderView;
