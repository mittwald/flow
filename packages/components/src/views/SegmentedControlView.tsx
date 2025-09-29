/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  SegmentedControl,
  type SegmentedControlProps,
} from "@/components/SegmentedControl/SegmentedControl";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const SegmentedControlView: FC<SegmentedControlProps> = memo((props) => {
  const View =
    useContext(viewComponentContext)["SegmentedControl"] ?? SegmentedControl;
  return <View {...props} />;
});
SegmentedControlView.displayName = "SegmentedControlView";

export default SegmentedControlView;
