"use client";
import * as remoteComponents from "@/auto-generated";
import * as customViewComponents from "@/views";
import { useWatchPathname } from "@/hooks/useWatchPathname";
import { stringifyError } from "@/lib/stringifyError";
import { ViewComponentContextProvider } from "@mittwald/flow-react-components/internal";
import {
  connectHostRenderRootRef,
  connectRemoteReceiver,
  type RemoteReceiver,
  type RemoteToHostConnection,
} from "@mittwald/flow-remote-core";
import {
  Suspense,
  useLayoutEffect,
  useRef,
  useState,
  useTransition,
  type CSSProperties,
  type FC,
  type PropsWithChildren,
} from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { RemoteContextProvider } from "@/components/RemoteContextProvider";
import { LoadingFallbackTrigger } from "@/components/LoadingFallbackTrigger";

const viewComponents = {
  ...remoteComponents,
  ...customViewComponents,
} as FlowViewComponents;

export interface RemoteRootProps extends PropsWithChildren {
  onHostPathnameChanged?: (pathname: string) => void;
  isLoading?: boolean;
  /** Internal use only */
  __remoteReceiver?: RemoteReceiver;
}

const hiddenStyle: CSSProperties = {
  visibility: "hidden",
  height: 0,
  width: 0,
  border: "none",
  position: "absolute",
  marginLeft: "-9999px",
};

export const RemoteRoot: FC<RemoteRootProps> = (props) => {
  const {
    children,
    onHostPathnameChanged,
    isLoading: isLoadingFromProps,
    __remoteReceiver: remoteReceiver,
  } = props;

  if (remoteReceiver) {
    return (
      <div
        style={hiddenStyle}
        ref={(div) => {
          if (div) {
            connectRemoteReceiver(div, remoteReceiver.connection);
          }
        }}
      >
        {children}
      </div>
    );
  }

  const connectionRef = useRef<RemoteToHostConnection>(undefined);
  const isConnectionInitialized = useRef(false);
  const [connectionError, setConnectionError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const [pathnameChangedPending, startPathnameChangedTransition] =
    useTransition();

  const renderErrorRef = useRef<unknown>(undefined);

  const handleRenderError = (error: unknown) => {
    renderErrorRef.current = error;
    connectionRef.current?.imports.setError(stringifyError(error));
  };

  const setIsLoadingFromProps = () => {
    if (isLoadingFromProps !== undefined) {
      connectionRef.current?.imports.setIsLoading(isLoadingFromProps);
    }
  };

  useLayoutEffect(() => {
    setIsLoadingFromProps();
  }, [isLoadingFromProps]);

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

  /** Is wrapped in Div to resolve render awaiter in <RemoteRenderer /> */
  const loadingFallback = (
    <remoteComponents.Div>
      <LoadingFallbackTrigger />
    </remoteComponents.Div>
  );

  const connectDiv = (div: HTMLDivElement) => {
    if (isConnectionInitialized.current) {
      return;
    }
    isConnectionInitialized.current = true;
    connect(div)
      ?.then((connection) => {
        connectionRef.current = connection;
        setIsLoadingFromProps();
        setIsConnected(true);
      })
      .catch((error) => {
        setConnectionError(error);
      });

    if (renderErrorRef.current) {
      handleRenderError(renderErrorRef.current);
    }
  };

  const ErrorFallbackComponent: FC<FallbackProps> = (props) => {
    handleRenderError(props.error);
    return null;
  };

  return (
    <div ref={connectDiv}>
      <ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
        {isConnected && connectionRef.current && (
          <RemoteContextProvider
            value={{
              connection: connectionRef.current,
            }}
          >
            <Suspense fallback={loadingFallback}>
              <ViewComponentContextProvider components={viewComponents}>
                {children}
              </ViewComponentContextProvider>
            </Suspense>
          </RemoteContextProvider>
        )}
      </ErrorBoundary>
    </div>
  );
};

export default RemoteRoot;
