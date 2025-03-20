"use client";
import * as viewComponents from "@/auto-generated";
import Preview from "@/components/Preview";
import { stringifyError } from "@/lib/stringifyError";
import type { ExtBridgeRemoteApi } from "@mittwald/ext-bridge";
import { ViewComponentContextProvider } from "@mittwald/flow-react-components/internal";
import {
  connectHostRenderRootRef,
  type RemoteToHostConnection,
} from "@mittwald/flow-remote-core";
import { Suspense, useRef, type FC, type PropsWithChildren } from "react";
import { ErrorBoundary } from "react-error-boundary";

export interface RootClientProps extends PropsWithChildren {
  showPreview?: boolean;
  extBridgeImplementation?: ExtBridgeRemoteApi;
}

export const RemoteRootClient: FC<RootClientProps> = (props) => {
  const { children, showPreview = false, ...previewProps } = props;

  const params = new URLSearchParams(document.location.search);
  const isInPreviewFrame = params.has("preview");
  const connectionRef = useRef<RemoteToHostConnection>(undefined);
  const errorRef = useRef<unknown>(undefined);

  const handleRenderError = (error: unknown) => {
    errorRef.current = error;
    connectionRef.current?.imports.setError(stringifyError(error));
  };

  const root = (
    <div
      ref={(div) => {
        connectionRef.current = connectHostRenderRootRef(div);
        if (errorRef.current) {
          handleRenderError(errorRef.current);
        }
      }}
    >
      <ErrorBoundary
        fallbackRender={({ error }) => {
          handleRenderError(error);
          return null;
        }}
      >
        <Suspense>
          <ViewComponentContextProvider
            components={viewComponents as FlowViewComponents}
          >
            {children}
          </ViewComponentContextProvider>
        </Suspense>
      </ErrorBoundary>
    </div>
  );

  if (isInPreviewFrame || !showPreview) {
    return root;
  }

  return <Preview {...previewProps} />;
};

export default RemoteRootClient;
