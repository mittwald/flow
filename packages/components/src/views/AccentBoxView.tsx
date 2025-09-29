/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  AccentBox,
  type AccentBoxProps,
} from "@/components/AccentBox/AccentBox";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const AccentBoxView: FC<AccentBoxProps> = memo((props) => {
  const View = useContext(viewComponentContext)["AccentBox"] ?? AccentBox;
  return <View {...props} />;
});
AccentBoxView.displayName = "AccentBoxView";

export default AccentBoxView;
