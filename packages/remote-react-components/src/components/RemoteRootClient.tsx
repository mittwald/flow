"use client";
import * as viewComponents from "@/auto-generated";
import Preview from "@/components/Preview";
import type { ExtBridgeRemoteApi } from "@mittwald/ext-bridge";
import { ViewComponentContextProvider } from "@mittwald/flow-react-components/internal";
import { connectHostRenderRootRef } from "@mittwald/flow-remote-core";
import { Suspense, type FC, type PropsWithChildren } from "react";

export interface RootClientProps extends PropsWithChildren {
  showPreview?: boolean;
  extBridgeImplementation?: ExtBridgeRemoteApi;
}

export const RemoteRootClient: FC<RootClientProps> = (props) => {
  const { children, showPreview = false, ...previewProps } = props;

  const params = new URLSearchParams(document.location.search);
  const isInPreviewFrame = params.has("preview");

  const root = (
    <div ref={connectHostRenderRootRef}>
      <Suspense>
        <ViewComponentContextProvider
          components={viewComponents as FlowViewComponents}
        >
          {children}
        </ViewComponentContextProvider>
      </Suspense>
    </div>
  );

  if (isInPreviewFrame || !showPreview) {
    return root;
  }

  return <Preview {...previewProps} />;
};

export default RemoteRootClient;
