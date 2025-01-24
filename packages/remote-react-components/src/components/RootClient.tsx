"use client";
import type { FC, PropsWithChildren } from "react";
import React from "react";
import { connectHostIframeRef } from "@mittwald/flow-remote-core";
import { ViewComponentContextProvider } from "@mittwald/flow-react-components/internal";
import * as viewComponents from "~/auto-generated";

export interface RootClientProps extends PropsWithChildren {
  showPreview?: boolean;
}

const RemoteRenderer = React.lazy(
  () => import("@mittwald/flow-remote-react-renderer/RemoteRenderer"),
);

const LazyStyles = React.lazy(() =>
  import("@mittwald/flow-react-components/all.css").then(() => ({
    default: () => null,
  })),
);

export const RootClient: FC<RootClientProps> = (props) => {
  const { children, showPreview } = props;

  const params = new URLSearchParams(document.location.search);
  const isInPreviewFrame = params.has("preview");
  const previewUrl = new URL(document.location.href);
  previewUrl.searchParams.set("preview", "");

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

  return (
    <>
      <LazyStyles />
      <RemoteRenderer src={previewUrl.toString()} />
    </>
  );
};

export default RootClient;
