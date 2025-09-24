/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { Segment, type SegmentProps } from "@/components/SegmentedControl";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const SegmentView: FC<SegmentProps> = memo((props) => {
  const View = useContext(viewComponentContext)["Segment"] ?? Segment;
  return <View {...props} />;
});
SegmentView.displayName = "SegmentView";

export default SegmentView;
