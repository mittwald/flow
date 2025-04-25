/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { XAxisProps } from "@/components/XAxis";
import React, { useContext } from "react";
import { XAxis } from "@/components/XAxis";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const XAxisView: FC<XAxisProps> = (props) => {
  const View = useContext(viewComponentContext)["XAxis"] ?? XAxis;
  return <View {...props} />;
};

export default XAxisView;
