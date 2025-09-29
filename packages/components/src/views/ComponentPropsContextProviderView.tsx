/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  ComponentPropsContextProvider,
  type ComponentPropsContextProviderProps,
} from "@/components/ComponentPropsContextProvider/ComponentPropsContextProvider";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ComponentPropsContextProviderView: FC<ComponentPropsContextProviderProps> =
  memo((props) => {
    const View =
      useContext(viewComponentContext)["ComponentPropsContextProvider"] ??
      ComponentPropsContextProvider;
    return <View {...props} />;
  });
ComponentPropsContextProviderView.displayName =
  "ComponentPropsContextProviderView";

export default ComponentPropsContextProviderView;
