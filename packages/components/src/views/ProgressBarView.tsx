/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { ProgressBar, type ProgressBarProps } from "@/components/ProgressBar";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ProgressBarView: FC<ProgressBarProps> = (props) => {
  const View = useContext(viewComponentContext)["ProgressBar"] ?? ProgressBar;
  return <View {...props} />;
};

export default ProgressBarView;
