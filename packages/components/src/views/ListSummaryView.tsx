/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { ListSummary, type ListSummaryProps } from "@/components/List";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ListSummaryView: FC<ListSummaryProps> = (props) => {
  const View = useContext(viewComponentContext)["ListSummary"] ?? ListSummary;
  return <View {...props} />;
};

export default ListSummaryView;
