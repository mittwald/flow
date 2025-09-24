/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { EmptyView, type EmptyViewProps } from "@/components/List";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ListEmptyViewView: FC<EmptyViewProps> = memo((props) => {
  const View = useContext(viewComponentContext)["ListEmptyView"] ?? EmptyView;
  return <View {...props} />;
});
ListEmptyViewView.displayName = "ListEmptyViewView";

export default ListEmptyViewView;
