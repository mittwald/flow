"use client";
import * as viewComponents from "@/auto-generated";
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
  extBridgeImplementation?: ExtBridgeRemoteApi;
}

export const RemoteRootClient: FC<RootClientProps> = (props) => {
  const { children } = props;

  const connectionRef = useRef<RemoteToHostConnection>(undefined);
  const errorRef = useRef<unknown>(undefined);

  const handleRenderError = (error: unknown) => {
    errorRef.current = error;
    connectionRef.current?.imports.setError(stringifyError(error));
  };

  return (
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
};

export default RemoteRootClient;
