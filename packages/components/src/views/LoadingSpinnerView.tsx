/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import {
  LoadingSpinner,
  type LoadingSpinnerProps,
} from "~/components/LoadingSpinner";
import { viewComponentContext } from "~/lib/viewComponentContext/viewComponentContext";

const LoadingSpinnerView: FC<LoadingSpinnerProps> = (props) => {
  const View =
    useContext(viewComponentContext)["LoadingSpinner"] ?? LoadingSpinner;
  return <View {...props} />;
};

export default LoadingSpinnerView;
