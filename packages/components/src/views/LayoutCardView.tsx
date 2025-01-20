/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { LayoutCard, type LayoutCardProps } from "~/components/LayoutCard";
import { viewComponentContext } from "~/lib/viewComponentContext/viewComponentContext";

const LayoutCardView: FC<LayoutCardProps> = (props) => {
  const View = useContext(viewComponentContext)["LayoutCard"] ?? LayoutCard;
  return <View {...props} />;
};

export default LayoutCardView;
