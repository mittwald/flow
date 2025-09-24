/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { AvatarStack, type AvatarStackProps } from "@/components/AvatarStack";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const AvatarStackView: FC<AvatarStackProps> = memo((props) => {
  const View = useContext(viewComponentContext)["AvatarStack"] ?? AvatarStack;
  return <View {...props} />;
});
AvatarStackView.displayName = "AvatarStackView";

export default AvatarStackView;
