/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  LoadingSpinner,
  type LoadingSpinnerProps,
} from "@/components/LoadingSpinner";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const LoadingSpinnerView: FC<LoadingSpinnerProps> = memo((props) => {
  const View =
    useContext(viewComponentContext)["LoadingSpinner"] ?? LoadingSpinner;
  return <View {...props} />;
});
LoadingSpinnerView.displayName = "LoadingSpinnerView";

export default LoadingSpinnerView;
