/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { BadgeProps } from "@/components/Badge";
import React, { useContext } from "react";
import { Badge } from "@/components/Badge";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const BadgeView: FC<BadgeProps> = (props) => {
  const View = useContext(viewComponentContext)["Badge"] ?? Badge;
  return <View {...props} />;
};

export default BadgeView;
