/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  LayoutCard,
  type LayoutCardProps,
} from "@/components/LayoutCard/LayoutCard";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const LayoutCardView: FC<LayoutCardProps> = memo((props) => {
  const View = useContext(viewComponentContext)["LayoutCard"] ?? LayoutCard;
  return <View {...props} />;
});
LayoutCardView.displayName = "LayoutCardView";

export default LayoutCardView;
