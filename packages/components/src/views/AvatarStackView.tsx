/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { AvatarStackProps } from "@/components/AvatarStack";
import React, { useContext } from "react";
import { AvatarStack } from "@/components/AvatarStack";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const AvatarStackView: FC<AvatarStackProps> = (props) => {
  const View = useContext(viewComponentContext)["AvatarStack"] ?? AvatarStack;
  return <View {...props} />;
};

export default AvatarStackView;
