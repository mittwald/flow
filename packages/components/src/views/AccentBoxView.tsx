/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { AccentBoxProps } from "@/components/AccentBox";
import React, { useContext } from "react";
import { AccentBox } from "@/components/AccentBox";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const AccentBoxView: FC<AccentBoxProps> = (props) => {
  const View = useContext(viewComponentContext)["AccentBox"] ?? AccentBox;
  return <View {...props} />;
};

export default AccentBoxView;
