/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { AlignProps } from "@/components/Align";
import React, { useContext } from "react";
import { Align } from "@/components/Align";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const AlignView: FC<AlignProps> = (props) => {
  const View = useContext(viewComponentContext)["Align"] ?? Align;
  return <View {...props} />;
};

export default AlignView;
