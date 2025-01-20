/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import {
  SegmentedControl,
  type SegmentedControlProps,
} from "~/components/SegmentedControl";
import { viewComponentContext } from "~/lib/viewComponentContext/viewComponentContext";

const SegmentedControlView: FC<SegmentedControlProps> = (props) => {
  const View =
    useContext(viewComponentContext)["SegmentedControl"] ?? SegmentedControl;
  return <View {...props} />;
};

export default SegmentedControlView;
