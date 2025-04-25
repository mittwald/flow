/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { YAxisProps } from "@/components/YAxis";
import React, { useContext } from "react";
import { YAxis } from "@/components/YAxis";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const YAxisView: FC<YAxisProps> = (props) => {
  const View = useContext(viewComponentContext)["YAxis"] ?? YAxis;
  return <View {...props} />;
};

export default YAxisView;
