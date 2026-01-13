/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  ColumnLayout,
  type ColumnLayoutProps,
} from "@/components/ColumnLayout/ColumnLayout";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ColumnLayoutView: FC<ColumnLayoutProps> = memo((props) => {
  const View = useContext(viewComponentContext)["ColumnLayout"] ?? ColumnLayout;
  return <View {...props} />;
});
ColumnLayoutView.displayName = "ColumnLayoutView";

export default ColumnLayoutView;
