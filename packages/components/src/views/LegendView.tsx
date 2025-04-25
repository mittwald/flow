/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { LegendProps } from "@/components/Legend";
import React, { useContext } from "react";
import { Legend } from "@/components/Legend";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const LegendView: FC<LegendProps> = (props) => {
  const View = useContext(viewComponentContext)["Legend"] ?? Legend;
  return <View {...props} />;
};

export default LegendView;
