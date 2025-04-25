/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { SegmentProps } from "@/components/SegmentedControl";
import React, { useContext } from "react";
import { Segment } from "@/components/SegmentedControl";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const SegmentView: FC<SegmentProps> = (props) => {
  const View = useContext(viewComponentContext)["Segment"] ?? Segment;
  return <View {...props} />;
};

export default SegmentView;
