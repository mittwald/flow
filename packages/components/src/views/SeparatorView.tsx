/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  Separator,
  type SeparatorProps,
} from "@/components/Separator/Separator";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const SeparatorView: FC<SeparatorProps> = memo((props) => {
  const View = useContext(viewComponentContext)["Separator"] ?? Separator;
  return <View {...props} />;
});
SeparatorView.displayName = "SeparatorView";

export default SeparatorView;
