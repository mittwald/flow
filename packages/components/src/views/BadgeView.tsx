/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { Badge, type BadgeProps } from "@/components/Badge/Badge";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const BadgeView: FC<BadgeProps> = memo((props) => {
  const View = useContext(viewComponentContext)["Badge"] ?? Badge;
  return <View {...props} />;
});
BadgeView.displayName = "BadgeView";

export default BadgeView;
