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
import { RemoteOriginThread } from "@/connection/originThreads";
import { RemoteError } from "@/error";
import { parseReportedEvent, type ReportedEvent } from "@/events/remoteEvents";
import { getWithMergedHostConfig } from "@/ext-bridge/getWithMergedHostConfig";
import { emptyImplementation } from "@/ext-bridge/implementation";
import { FlowThreadSerialization } from "@/serialization/FlowThreadSerialization";
import type { HostConfig } from "@mittwald/ext-bridge";
import type { RemoteConnection } from "@mittwald/remote-dom-core/elements";

export interface ConnectRemoteIframeOptions {
  connection: RemoteConnection;
  iframe: HTMLIFrameElement;
  hostConfig: HostConfig;
  onReady?: (event: HostToRemoteConnectionReadyEvent) => void;
  onLoadingChanged?: (isLoading: boolean) => void;
  onError?: (error: string) => void;
  onNavigationStateChanged?: (state: NavigationState) => void;
  onDeprecation?: (message: string) => void;
  onEvent?: (event: ReportedEvent) => void;
  extBridgeImplementation?: RemoteExtBridgeConnectionApi;
  /** Expected origin of the remote iframe. Defaults to the iframe URL origin. */
  remoteOrigin?: string;
  /** Minimum communication version required before rendering the remote app. */
  minRemoteVersion?: Version;
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

const guardedHostExports = <Exports extends object>(
  exports: Exports,
  isReady: () => boolean,
  minRemoteVersion: Version,
): Exports =>
  new Proxy(exports, {
    get(target, property, receiver) {
      const value = Reflect.get(target, property, receiver);

      if (typeof value !== "function") {
        return value;
      }

      return async (...args: unknown[]) => {
        if (!isReady()) {
          throw new RemoteError(
            `Remote has not reported the required version ${minRemoteVersion}`,
          );
        }

        return Reflect.apply(value, target, args);
      };
    },
  });

export const connectRemoteIframe = (
  opts: ConnectRemoteIframeOptions,
): HostToRemoteConnection => {
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
    remoteOrigin,
    minRemoteVersion,
  } = opts;

  const extBridgeImplementation = {
    getSessionToken: () => extBridgeImplementationProp.getSessionToken(),
    getConfig: getWithMergedHostConfig(extBridgeImplementationProp, hostConfig),
  };

  let isRequiredVersionReady = minRemoteVersion === undefined;
  let hasRendered = false;

  const hostExportsWithoutReady = {
    ...extBridgeImplementation,
    setIsLoading: async (isLoading: boolean) => {
      onLoadingChanged?.(isLoading);
    },
    setError: async (error: string) => {
      onError?.(error);
    },
    setNavigationState: async (state: NavigationState) => {
      onNavigationStateChanged?.(state);
    },
    reportDeprecation: async (message: string) => {
      onDeprecation?.(message);
    },
    reportEvent: async (event: ReportedEvent) => {
      const parsed = parseReportedEvent(event);
      if (parsed) {
        onEvent?.(parsed);
      }
    },
    getHostConfig: async () => hostConfig,
  };

  const exportsWithVersionRequirement =
    minRemoteVersion === undefined
      ? hostExportsWithoutReady
      : guardedHostExports(
          hostExportsWithoutReady,
          () => isRequiredVersionReady,
          minRemoteVersion,
        );

  const result: HostToRemoteConnection = {
    thread: new RemoteOriginThread<RemoteExports, HostExports>(iframe, {
      remoteOrigin,
      serialization: new FlowThreadSerialization(),
      exports: {
        ...exportsWithVersionRequirement,
        setIsReady: async (event) => {
          const readyEvent = normalizeReadyEvent(event);

          if (
            minRemoteVersion !== undefined &&
            readyEvent.version < minRemoteVersion
          ) {
            onError?.(
              `Remote version ${readyEvent.version} is lower than the required version ${minRemoteVersion}`,
            );
            return;
          }

          result.version = readyEvent.version;
          isRequiredVersionReady = true;
          onReady?.({
            connection: result,
            remoteReadyEvent: readyEvent,
          });

          if (minRemoteVersion !== undefined && !hasRendered) {
            hasRendered = true;
            void result.thread.imports.render(connection);
          }
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

  if (minRemoteVersion === undefined) {
    hasRendered = true;
    void result.thread.imports.render(connection);
  }
  return result;
};

export const connectRemoteIframeRef =
  (opts: Omit<ConnectRemoteIframeOptions, "iframe">) =>
  (ref: HTMLIFrameElement | null) => {
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
