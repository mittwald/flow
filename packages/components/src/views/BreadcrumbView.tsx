/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { BreadcrumbProps } from "@/components/Breadcrumb";
import React, { useContext } from "react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const BreadcrumbView: FC<BreadcrumbProps> = (props) => {
  const View = useContext(viewComponentContext)["Breadcrumb"] ?? Breadcrumb;
  return <View {...props} />;
};

export default BreadcrumbView;
