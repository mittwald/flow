/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { Combine, type CombineProps } from "@/components/Combine/Combine";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const CombineView: FC<CombineProps> = memo((props) => {
  const View = useContext(viewComponentContext)["Combine"] ?? Combine;
  return <View {...props} />;
});
CombineView.displayName = "CombineView";

export default CombineView;
