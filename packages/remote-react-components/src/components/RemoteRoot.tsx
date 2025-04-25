"use client";
import * as remoteComponents from "@/auto-generated";
import * as customViewComponents from "@/views";
import { stringifyError } from "@/lib/stringifyError";
import { ViewComponentContextProvider } from "@mittwald/flow-react-components/internal";
import { connectHostRenderRootRef } from "@mittwald/flow-remote-core";
import type { RemoteToHostConnection } from "@mittwald/flow-remote-core";
import { Suspense, useRef, useState } from "react";
import type { FC, PropsWithChildren } from "react";
import { ErrorBoundary } from "react-error-boundary";

const viewComponents = {
  ...remoteComponents,
  ...customViewComponents,
};

export const RemoteRoot: FC<PropsWithChildren> = (props) => {
  const { children } = props;

  const connectionRef = useRef<RemoteToHostConnection>(undefined);
  const [connectionError, setConnectionError] = useState(null);

  const renderErrorRef = useRef<unknown>(undefined);

  const handleRenderError = (error: unknown) => {
    renderErrorRef.current = error;
    connectionRef.current?.imports.setError(stringifyError(error));
  };

  if (connectionError) {
    throw connectionError;
  }

  return (
    <div
      ref={(div) => {
        connectHostRenderRootRef(div)
          ?.then((connection) => {
            connectionRef.current = connection;
          })
          .catch((error) => {
            setConnectionError(error);
          });

        if (renderErrorRef.current) {
          handleRenderError(renderErrorRef.current);
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
          <ViewComponentContextProvider components={viewComponents}>
            {children}
          </ViewComponentContextProvider>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default RemoteRoot;
