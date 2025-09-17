/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import {
  ComponentPropsContextProvider,
  type ComponentPropsContextProviderProps,
} from "@/components/ComponentPropsContextProvider";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ComponentPropsContextProviderView: FC<
  ComponentPropsContextProviderProps
> = (props) => {
  const View =
    useContext(viewComponentContext)["ComponentPropsContextProvider"] ??
    ComponentPropsContextProvider;
  return <View {...props} />;
};

export default ComponentPropsContextProviderView;
