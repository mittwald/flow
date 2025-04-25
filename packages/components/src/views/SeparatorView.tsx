/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { SeparatorProps } from "@/components/Separator";
import React, { useContext } from "react";
import { Separator } from "@/components/Separator";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const SeparatorView: FC<SeparatorProps> = (props) => {
  const View = useContext(viewComponentContext)["Separator"] ?? Separator;
  return <View {...props} />;
};

export default SeparatorView;
