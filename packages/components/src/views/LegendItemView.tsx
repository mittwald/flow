/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  LegendItem,
  type LegendItemProps,
} from "@/components/Legend/components/LegendItem/LegendItem";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const LegendItemView: FC<LegendItemProps> = memo((props) => {
  const View = useContext(viewComponentContext)["LegendItem"] ?? LegendItem;
  return <View {...props} />;
});
LegendItemView.displayName = "LegendItemView";

export default LegendItemView;
