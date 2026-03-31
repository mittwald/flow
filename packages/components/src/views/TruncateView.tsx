/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { Truncate, type TruncateProps } from "@/components/Truncate/Truncate";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const TruncateView: FC<TruncateProps> = memo((props) => {
  const View = useContext(viewComponentContext)["Truncate"] ?? Truncate;
  return <View {...props} />;
});
TruncateView.displayName = "TruncateView";

export default TruncateView;
