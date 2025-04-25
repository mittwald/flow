/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { AreaProps } from "@/components/AreaChart";
import React, { useContext } from "react";
import { Area } from "@/components/AreaChart";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const AreaView: FC<AreaProps> = (props) => {
  const View = useContext(viewComponentContext)["Area"] ?? Area;
  return <View {...props} />;
};

export default AreaView;
