/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { Rating, type RatingProps } from "@/components/Rating";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const RatingView: FC<RatingProps> = (props) => {
  const View = useContext(viewComponentContext)["Rating"] ?? Rating;
  return <View {...props} />;
};

export default RatingView;
