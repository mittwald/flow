/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { ColumnLayoutProps } from "@/components/ColumnLayout";
import React, { useContext } from "react";
import { ColumnLayout } from "@/components/ColumnLayout";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ColumnLayoutView: FC<ColumnLayoutProps> = (props) => {
  const View = useContext(viewComponentContext)["ColumnLayout"] ?? ColumnLayout;
  return <View {...props} />;
};

export default ColumnLayoutView;
