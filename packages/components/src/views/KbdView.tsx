/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { Kbd, type KbdProps } from "@/components/Kbd/Kbd";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const KbdView: FC<KbdProps> = memo((props) => {
  const View = useContext(viewComponentContext)["Kbd"] ?? Kbd;
  return <View {...props} />;
});
KbdView.displayName = "KbdView";

export default KbdView;
