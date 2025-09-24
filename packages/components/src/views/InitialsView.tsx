/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { Initials, type InitialsProps } from "@/components/Initials";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const InitialsView: FC<InitialsProps> = memo((props) => {
  const View = useContext(viewComponentContext)["Initials"] ?? Initials;
  return <View {...props} />;
});
InitialsView.displayName = "InitialsView";

export default InitialsView;
