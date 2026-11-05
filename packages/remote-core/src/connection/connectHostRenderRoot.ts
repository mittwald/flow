import {
  Version,
  type HostExports,
  type RemoteExports,
  type RemoteToHostConnection,
} from "@/connection/types";
import { HostOriginThread } from "@/connection/originThreads";
import { toRelativePathname } from "@/connection/toRelativePathname";
import { RemoteError } from "@/error";
import { FlowThreadSerialization } from "@/serialization/FlowThreadSerialization";
import { type RemoteConnection } from "@mittwald/remote-dom-core/elements";

export interface ConnectHostRenderRootOptions {
  root: HTMLDivElement;
  onPathnameChanged?: (pathname: string) => void;
  onHostError?: (error: string) => void;
  packageVersion?: string;
  /** Additional host origins accepted by the remote app. */
  allowedHostOrigins?: string[];
}

const incompatibleParentFrameError = () =>
  new RemoteError("Could not find any compatible parent frame");

export const connectRemoteReceiver = (
  root: HTMLDivElement,
  receiverConnection: RemoteConnection,
) =>
  import("@mittwald/remote-dom-core/elements").then(
    ({ RemoteMutationObserver }) => {
      const observer = new RemoteMutationObserver(receiverConnection);
      observer.observe(root);
    },
  );

export const connectHostRenderRoot = async (
  options: ConnectHostRenderRootOptions,
): Promise<RemoteToHostConnection> => {
  const {
    root,
    onPathnameChanged,
    onHostError,
    packageVersion,
    allowedHostOrigins,
  } = options;

  const connection = new HostOriginThread<HostExports, RemoteExports>({
    allowedHostOrigins,
    serialization: new FlowThreadSerialization(),
    exports: {
      render: (connection: RemoteConnection) =>
        connectRemoteReceiver(root, connection),
      setPathname: async (pathname) => {
        const relativePathname = toRelativePathname(pathname);
        if (relativePathname !== undefined) {
          onPathnameChanged?.(relativePathname);
        }
      },
      setHostError: async (error) => {
        onHostError?.(error);
      },
    },
  });

  if (connection.parent === window) {
    throw incompatibleParentFrameError();
  }

  try {
    await connection.imports.setIsReady({
      version: Version.v6,
      packageVersion,
    });

    if (typeof mwExtBridge !== "undefined") {
      mwExtBridge.connection = connection.imports;
      await mwExtBridge.readiness.setIsReady();
    }

    return connection;
  } catch (error) {
    if (
      error instanceof Error &&
      /No '.*' method is exported from this thread/.test(error.message)
    ) {
      throw incompatibleParentFrameError();
    }
    throw error;
  }
};

export const connectHostRenderRootRef =
  (opts: Omit<ConnectHostRenderRootOptions, "root">) =>
  (ref: HTMLDivElement | null) => {
    if (ref === null) {
      return;
    }
    if ("__remoteConnection" in ref) {
      return ref["__remoteConnection"] as Promise<RemoteToHostConnection>;
    }

    const connection = connectHostRenderRoot({
      root: ref,
      ...opts,
    });
    Object.assign(ref, { __remoteConnection: connection });
    return connection;
  };
