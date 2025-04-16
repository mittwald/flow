"use client";
import * as viewComponents from "@/auto-generated";
import { stringifyError } from "@/lib/stringifyError";
import { ViewComponentContextProvider } from "@mittwald/flow-react-components/internal";
import {
  connectHostRenderRootRef,
  type RemoteToHostConnection,
} from "@mittwald/flow-remote-core";
import {
  Suspense,
  useRef,
  useState,
  type FC,
  type PropsWithChildren,
} from "react";
import { ErrorBoundary } from "react-error-boundary";

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

export default RemoteRoot;
