/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  Breadcrumb,
  type BreadcrumbProps,
} from "@/components/Breadcrumb/Breadcrumb";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const BreadcrumbView: FC<BreadcrumbProps> = memo((props) => {
  const View = useContext(viewComponentContext)["Breadcrumb"] ?? Breadcrumb;
  return <View {...props} />;
});
BreadcrumbView.displayName = "BreadcrumbView";

export default BreadcrumbView;
