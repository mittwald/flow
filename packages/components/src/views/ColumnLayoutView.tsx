/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import {
  ColumnLayout,
  type ColumnLayoutProps,
} from "~/components/ColumnLayout";
import { viewComponentContext } from "~/lib/viewComponentContext/viewComponentContext";

const ColumnLayoutView: FC<ColumnLayoutProps> = (props) => {
  const View = useContext(viewComponentContext)["ColumnLayout"] ?? ColumnLayout;
  return <View {...props} />;
};

export default ColumnLayoutView;
