/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { TunnelEntry, type TunnelEntryProps } from "@/components/TunnelEntry";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const TunnelEntryView: FC<TunnelEntryProps> = (props) => {
  const View = useContext(viewComponentContext)["TunnelEntry"] ?? TunnelEntry;
  return <View {...props} />;
};

export default TunnelEntryView;
