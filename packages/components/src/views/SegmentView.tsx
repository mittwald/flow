/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { Segment, type SegmentProps } from "@/components/SegmentedControl";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const SegmentView: FC<SegmentProps> = (props) => {
  const View = useContext(viewComponentContext)["Segment"] ?? Segment;
  return <View {...props} />;
};

export default SegmentView;
