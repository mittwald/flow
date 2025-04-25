/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { RatingProps } from "@/components/Rating";
import React, { useContext } from "react";
import { Rating } from "@/components/Rating";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const RatingView: FC<RatingProps> = (props) => {
  const View = useContext(viewComponentContext)["Rating"] ?? Rating;
  return <View {...props} />;
};

export default RatingView;
