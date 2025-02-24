"use client";
import * as viewComponents from "@/auto-generated";
import Preview from "@/components/Preview";
import { ViewComponentContextProvider } from "@mittwald/flow-react-components/internal";
import { connectHostRenderRootRef } from "@mittwald/flow-remote-core";
import { type FC, type PropsWithChildren, type ReactNode } from "react";

export interface RootClientProps extends PropsWithChildren {
  showPreview?: boolean;
  fallback?: ReactNode;
}

export const RemoteRootClient: FC<RootClientProps> = (props) => {
  const { children, showPreview = false, ...previewProps } = props;

  const params = new URLSearchParams(document.location.search);
  const isInPreviewFrame = params.has("preview");

  const root = (
    <div ref={connectHostRenderRootRef}>
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

  return <Preview {...previewProps} />;
};

export default RemoteRootClient;
