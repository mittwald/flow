/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  Bar,
  type BarProps,
} from "@/components/CartesianChart/components/Bar/Bar";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const BarView: FC<BarProps> = memo((props) => {
  const View = useContext(viewComponentContext)["Bar"] ?? Bar;
  return <View {...props} />;
});
BarView.displayName = "BarView";

export default BarView;
