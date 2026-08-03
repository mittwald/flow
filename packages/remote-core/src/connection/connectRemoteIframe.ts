import {
  Version,
  type HostExports,
  type HostToRemoteConnection,
  type HostToRemoteConnectionReadyEvent,
  type NavigationState,
  type RemoteExports,
  type RemoteExtBridgeConnectionApi,
  type RemoteReadyEvent,
  type RemoteReadyEventInput,
} from "@/connection/types";
import { parseReportedEvent, type ReportedEvent } from "@/events/remoteEvents";
import { getWithMergedHostConfig } from "@/ext-bridge/getWithMergedHostConfig";
import { emptyImplementation } from "@/ext-bridge/implementation";
import { FlowThreadSerialization } from "@/serialization/FlowThreadSerialization";
import { type HostConfig } from "@mittwald/flow-core";
import type { RemoteConnection } from "@mittwald/remote-dom-core/elements";
import { ThreadIframe } from "@quilted/threads";

interface Options {
  connection: RemoteConnection;
  iframe: HTMLIFrameElement;
  hostConfig: HostConfig;
  onReady?: (event: HostToRemoteConnectionReadyEvent) => void;
  onLoadingChanged?: (isLoading: boolean) => void;
  onError?: (error: string) => void;
  onNavigationStateChanged?: (state: NavigationState) => void;
  onDeprecation?: (message: string) => void;
  /** Receives events a remote reports; unparseable ones never arrive here. */
  onEvent?: (event: ReportedEvent) => void;
  extBridgeImplementation?: RemoteExtBridgeConnectionApi;
}

const normalizeReadyEvent = (
  event?: RemoteReadyEventInput,
): RemoteReadyEvent => {
  if (typeof event === "number") {
    return {
      version: event,
    };
  }

  return (
    event ?? {
      version: Version.v1,
    }
  );
};

export const connectRemoteIframe = (opts: Options): HostToRemoteConnection => {
  const {
    connection,
    iframe,
    onReady,
    onLoadingChanged,
    onError,
    onNavigationStateChanged,
    onDeprecation,
    onEvent,
    extBridgeImplementation: extBridgeImplementationProp = emptyImplementation,
    hostConfig,
  } = opts;

  const extBridgeImplementation = {
    ...extBridgeImplementationProp,
    getConfig: getWithMergedHostConfig(extBridgeImplementationProp, hostConfig),
  };

  const result: HostToRemoteConnection = {
    thread: new ThreadIframe<RemoteExports, HostExports>(iframe, {
      serialization: new FlowThreadSerialization(),
      exports: {
        ...extBridgeImplementation,
        setIsReady: async (event) => {
          const readyEvent = normalizeReadyEvent(event);
          result.version = readyEvent.version;
          onReady?.({
            connection: result,
            remoteReadyEvent: readyEvent,
          });
        },
        setIsLoading: async (isLoading: boolean) => {
          onLoadingChanged?.(isLoading);
        },
        setError: async (error: string) => {
          onError?.(error);
        },
        setNavigationState: async (state) => {
          onNavigationStateChanged?.(state);
        },
        reportDeprecation: async (message: string) => {
          onDeprecation?.(message);
        },
        reportEvent: async (event) => {
          const parsed = parseReportedEvent(event);
          if (parsed) {
            onEvent?.(parsed);
          }
        },
        getHostConfig: async () => {
          return hostConfig;
        },
      },
    }),
    updateHostPathname: (hostPathname?: string) => {
      if (hostPathname === undefined) {
        return;
      }

      if (result.version >= Version.v2) {
        result.thread.imports.setPathname(hostPathname);
      }
    },
    reportHostError: async (error) => {
      if (result.version >= Version.v5) {
        await result.thread.imports.setHostError(error);
      }
    },
    version: 0,
  };

  result.thread.imports.render(connection);
  return result;
};

export const connectRemoteIframeRef =
  (opts: Omit<Options, "iframe">) => (ref: HTMLIFrameElement | null) => {
    if (!ref) {
      return;
    }

    if ("__remoteConnection" in ref) {
      return ref["__remoteConnection"] as HostToRemoteConnection;
    }

    const connection = connectRemoteIframe({
      iframe: ref,
      ...opts,
    });
    Object.assign(ref, { __remoteConnection: connection });
    return connection;
  };
