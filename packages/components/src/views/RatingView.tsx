/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { Rating, type RatingProps } from "@/components/Rating/Rating";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const RatingView: FC<RatingProps> = memo((props) => {
  const View = useContext(viewComponentContext)["Rating"] ?? Rating;
  return <View {...props} />;
});
RatingView.displayName = "RatingView";

export default RatingView;
