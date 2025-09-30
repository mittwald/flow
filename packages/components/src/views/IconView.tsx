/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { Icon, type IconProps } from "@/components/Icon";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const IconView: FC<IconProps> = memo((props) => {
  const View = useContext(viewComponentContext)["Icon"] ?? Icon;
  return <View {...props} />;
});
IconView.displayName = "IconView";

export default IconView;
