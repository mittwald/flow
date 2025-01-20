/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { Avatar, type AvatarProps } from "~/components/Avatar";
import { viewComponentContext } from "~/lib/viewComponentContext/viewComponentContext";

const AvatarView: FC<AvatarProps> = (props) => {
  const View = useContext(viewComponentContext)["Avatar"] ?? Avatar;
  return <View {...props} />;
};

export default AvatarView;
