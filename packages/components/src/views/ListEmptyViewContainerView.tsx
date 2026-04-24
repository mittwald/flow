/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  EmptyViewContainer,
  type EmptyViewContainerProps,
} from "@/components/List/views/EmptyViewContainer/EmptyViewContainer";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ListEmptyViewContainerView: FC<EmptyViewContainerProps> = memo(
  (props) => {
    const View =
      useContext(viewComponentContext)["ListEmptyViewContainer"] ??
      EmptyViewContainer;
    return <View {...props} />;
  },
);
ListEmptyViewContainerView.displayName = "ListEmptyViewContainerView";

export default ListEmptyViewContainerView;
