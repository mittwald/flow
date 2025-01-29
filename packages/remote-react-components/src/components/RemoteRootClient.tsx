"use client";
import type { FC, PropsWithChildren } from "react";
import React from "react";
import { connectHostIframeRef } from "@mittwald/flow-remote-core";
import { ViewComponentContextProvider } from "@mittwald/flow-react-components/internal";
import * as viewComponents from "~/auto-generated";
import Preview from "~/components/Preview";

export interface RootClientProps extends PropsWithChildren {
  showPreview?: boolean;
}

export const RemoteRootClient: FC<RootClientProps> = (props) => {
  const { children, showPreview = false } = props;

  const params = new URLSearchParams(document.location.search);
  const isInPreviewFrame = params.has("preview");

  const root = (
    <div
      ref={connectHostIframeRef}
      style={{
        height: 0,
        width: 0,
        left: -9999,
        position: "absolute",
      }}
    >
      <ViewComponentContextProvider
        components={viewComponents as FlowViewComponents}
      >
        {children}
      </ViewComponentContextProvider>
    </div>
  );

  if (isInPreviewFrame || !showPreview) {
    return root;
  }

  return <Preview />;
};

export default RemoteRootClient;
