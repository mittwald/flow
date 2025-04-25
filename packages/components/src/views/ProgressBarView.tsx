/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { ProgressBarProps } from "@/components/ProgressBar";
import React, { useContext } from "react";
import { ProgressBar } from "@/components/ProgressBar";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ProgressBarView: FC<ProgressBarProps> = (props) => {
  const View = useContext(viewComponentContext)["ProgressBar"] ?? ProgressBar;
  return <View {...props} />;
};

export default ProgressBarView;
