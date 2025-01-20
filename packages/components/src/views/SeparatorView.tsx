/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { Separator, type SeparatorProps } from "~/components/Separator";
import { viewComponentContext } from "~/lib/viewComponentContext/viewComponentContext";

const SeparatorView: FC<SeparatorProps> = (props) => {
  const View = useContext(viewComponentContext)["Separator"] ?? Separator;
  return <View {...props} />;
};

export default SeparatorView;
