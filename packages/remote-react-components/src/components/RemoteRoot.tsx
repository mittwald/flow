"use client";
import * as remoteComponents from "@/auto-generated";
import { SuspenseTrigger } from "@/auto-generated";
import * as customViewComponents from "@/views";
import { useWatchPathname } from "@/hooks/useWatchPathname";
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
  useTransition,
  type FC,
  type PropsWithChildren,
} from "react";
import { ErrorBoundary } from "react-error-boundary";

const viewComponents = {
  ...remoteComponents,
  ...customViewComponents,
} as FlowViewComponents;

export interface RemoteRootProps extends PropsWithChildren {
  onHostPathnameChanged?: (pathname: string) => void;
}

export const RemoteRoot: FC<RemoteRootProps> = (props) => {
  const { children, onHostPathnameChanged } = props;

  const connectionRef = useRef<RemoteToHostConnection>(undefined);
  const [connectionError, setConnectionError] = useState(null);

  const [pathnameChangedPending, startPathnameChangedTransition] =
    useTransition();

  const renderErrorRef = useRef<unknown>(undefined);

  const handleRenderError = (error: unknown) => {
    renderErrorRef.current = error;
    connectionRef.current?.imports.setError(stringifyError(error));
  };

  useWatchPathname((pathname) =>
    connectionRef.current?.imports.setNavigationState({
      pathname,
      isPending: pathnameChangedPending,
    }),
  );

  if (connectionError) {
    throw connectionError;
  }

  const connect = connectHostRenderRootRef({
    onPathnameChanged: (pathname) =>
      startPathnameChangedTransition(() => onHostPathnameChanged?.(pathname)),
  });

  return (
    <div
      ref={(div) => {
        connect(div)
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
        <Suspense fallback={<SuspenseTrigger />}>
          <ViewComponentContextProvider components={viewComponents}>
            {children}
          </ViewComponentContextProvider>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default RemoteRoot;
