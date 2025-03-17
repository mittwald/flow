/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { AccentBox, type AccentBoxProps } from "@/components/AccentBox";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const AccentBoxView: FC<AccentBoxProps> = (props) => {
  const View = useContext(viewComponentContext)["AccentBox"] ?? AccentBox;
  return <View {...props} />;
};

export default AccentBoxView;
