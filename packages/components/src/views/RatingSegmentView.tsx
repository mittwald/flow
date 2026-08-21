/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  RatingSegment,
  type RatingSegmentProps,
} from "@/components/Rating/components/RatingSegment/RatingSegment";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const RatingSegmentView: FC<RatingSegmentProps> = memo((props) => {
  const View =
    useContext(viewComponentContext)["RatingSegment"] ?? RatingSegment;
  return <View {...props} />;
});
RatingSegmentView.displayName = "RatingSegmentView";

export default RatingSegmentView;
