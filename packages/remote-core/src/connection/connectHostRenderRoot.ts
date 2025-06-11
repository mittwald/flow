import {
  Version,
  type HostExports,
  type RemoteExports,
  type RemoteToHostConnection,
} from "@/connection/types";
import { FlowThreadSerialization } from "@/serialization/FlowThreadSerialization";
import { type RemoteConnection } from "@mittwald/remote-dom-core/elements";
import { ThreadNestedIframe } from "@quilted/threads";

interface Options {
  root: HTMLDivElement;
  onPathnameChanged?: (pathname: string) => void;
}

export const connectHostRenderRoot = async (
  options: Options,
): Promise<RemoteToHostConnection> => {
  const { root, onPathnameChanged } = options;

  const connection = new ThreadNestedIframe<HostExports, RemoteExports>({
    serialization: new FlowThreadSerialization(),
    exports: {
      render: (connection: RemoteConnection) =>
        import("@mittwald/remote-dom-core/elements").then(
          ({ RemoteMutationObserver }) => {
            const observer = new RemoteMutationObserver(connection);
            observer.observe(root);
          },
        ),
      setPathname: async (pathname) => {
        onPathnameChanged?.(pathname);
      },
    },
  });

  if (connection.parent === window) {
  }

  await connection.imports.setIsReady(Version.v3);

  if (typeof mwExtBridge !== "undefined") {
    mwExtBridge.connection = connection.imports;
    await mwExtBridge.readiness.setIsReady();
  }

  return connection;
};

export const connectHostRenderRootRef =
  (opts: Omit<Options, "root">) => (ref: HTMLDivElement | null) => {
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
