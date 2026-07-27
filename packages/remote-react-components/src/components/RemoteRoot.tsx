"use client";
import * as remoteComponents from "@/auto-generated";
import * as customViewComponents from "@/views";
import { useWatchPathname } from "@/hooks/useWatchPathname";
import { stringifyError } from "@/lib/stringifyError";
import { packageVersion } from "@/version";
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
import {
  DeprecationWarningProvider,
  type DeprecationWarningHandler,
  IntlProvider,
  useLanguage,
} from "@mittwald/flow-react-components/flr-universal";
import type { HostConfig } from "@mittwald/flow-core";
import { initExtBridge } from "@mittwald/ext-bridge/browser";

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
    isLoading,
    __remoteReceiver: remoteReceiver,
  } = props;

  // The two branches use disjoint sets of hooks, so they live in dedicated
  // components. This keeps each component's hook order stable (Rules of Hooks)
  // while preserving the exact rendering of both paths.
  if (remoteReceiver) {
    return (
      <RemoteReceiverRoot remoteReceiver={remoteReceiver}>
        {children}
      </RemoteReceiverRoot>
    );
  }

  return (
    <RemoteConnectionRoot
      onHostPathnameChanged={onHostPathnameChanged}
      isLoading={isLoading}
    >
      {children}
    </RemoteConnectionRoot>
  );
};

interface RemoteReceiverRootProps extends PropsWithChildren {
  remoteReceiver: RemoteReceiver;
}

const RemoteReceiverRoot: FC<RemoteReceiverRootProps> = ({
  remoteReceiver,
  children,
}) => (
  <div
    style={hiddenStyle}
    ref={(div) => {
      if (div) {
        connectRemoteReceiver(div, remoteReceiver.connection);
      }
    }}
  >
    <ViewComponentContextProvider components={viewComponents}>
      {children}
    </ViewComponentContextProvider>
  </div>
);

type RemoteConnectionRootProps = Omit<RemoteRootProps, "__remoteReceiver">;

const RemoteConnectionRoot: FC<RemoteConnectionRootProps> = (props) => {
  const {
    children,
    onHostPathnameChanged,
    isLoading: isLoadingFromProps,
  } = props;

  const connectionRef = useRef<RemoteToHostConnection>(undefined);
  const hostConfigRef = useRef<HostConfig | undefined>(undefined);
  const isConnectionInitialized = useRef(false);
  const [connectionError, setConnectionError] = useState(null);
  const [hostError, setHostError] = useState<string | undefined>(undefined);
  const [isConnected, setIsConnected] = useState(false);

  const fallbackLanguage = useLanguage();
  const language =
    hostConfigRef.current?.language === undefined ||
    hostConfigRef.current?.language?.trim() === ""
      ? fallbackLanguage
      : hostConfigRef.current.language;

  const [pathnameChangedPending, startPathnameChangedTransition] =
    useTransition();

  const renderErrorRef = useRef<unknown>(undefined);

  const handleRenderError = (error: unknown) => {
    renderErrorRef.current = error;
    connectionRef.current?.imports.setError(stringifyError(error));
  };

  const forwardDeprecationWarning: DeprecationWarningHandler = (message) => {
    void connectionRef.current?.imports
      .reportDeprecation?.(message)
      ?.catch(() => {
        // ignore: host does not support deprecation reporting
      });
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

  if (hostError) {
    throw new Error(hostError);
  }

  const connect = connectHostRenderRootRef({
    onPathnameChanged: (pathname) =>
      startPathnameChangedTransition(() => onHostPathnameChanged?.(pathname)),
    onHostError: (error) => setHostError(error),
    packageVersion,
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
    initExtBridge();
    isConnectionInitialized.current = true;
    connect(div)
      ?.then((connection) => {
        connectionRef.current = connection;
        setIsLoadingFromProps();
        return connection.imports.getHostConfig();
      })
      .then((hostConfig) => {
        hostConfigRef.current = hostConfig;
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
            <IntlProvider locale={language}>
              <DeprecationWarningProvider onWarning={forwardDeprecationWarning}>
                <Suspense fallback={loadingFallback}>
                  <ViewComponentContextProvider components={viewComponents}>
                    {children}
                  </ViewComponentContextProvider>
                </Suspense>
              </DeprecationWarningProvider>
            </IntlProvider>
          </RemoteContextProvider>
        )}
      </ErrorBoundary>
    </div>
  );
};

export default RemoteRoot;
