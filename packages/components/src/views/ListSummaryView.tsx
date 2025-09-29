/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  ListSummary,
  type ListSummaryProps,
} from "@/components/List/components/ListSummary/ListSummary";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ListSummaryView: FC<ListSummaryProps> = memo((props) => {
  const View = useContext(viewComponentContext)["ListSummary"] ?? ListSummary;
  return <View {...props} />;
});
ListSummaryView.displayName = "ListSummaryView";

export default ListSummaryView;
