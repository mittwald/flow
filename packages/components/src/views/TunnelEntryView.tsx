/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  TunnelEntry,
  type TunnelEntryProps,
} from "@/components/TunnelEntry/TunnelEntry";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const TunnelEntryView: FC<TunnelEntryProps> = memo((props) => {
  const View = useContext(viewComponentContext)["TunnelEntry"] ?? TunnelEntry;
  return <View {...props} />;
});
TunnelEntryView.displayName = "TunnelEntryView";

export default TunnelEntryView;
