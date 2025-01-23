"use client";
import type { FC, PropsWithChildren } from "react";
import React from "react";
import { connectHostIframeRef } from "@mittwald/flow-remote-core";
import { ViewComponentContextProvider } from "@mittwald/flow-react-components/internal";
import * as viewComponents from "~/auto-generated";

type Props = PropsWithChildren;

export const RootClient: FC<Props> = (props) => {
  const { children } = props;

  return (
    <div ref={connectHostIframeRef}>
      <ViewComponentContextProvider
        components={viewComponents as FlowViewComponents}
      >
        {children}
      </ViewComponentContextProvider>
    </div>
  );
};

export default RootClient;
