/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { IconProps } from "@/components/Icon";
import React, { useContext } from "react";
import { Icon } from "@/components/Icon";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const IconView: FC<IconProps> = (props) => {
  const View = useContext(viewComponentContext)["Icon"] ?? Icon;
  return <View {...props} />;
};

export default IconView;
