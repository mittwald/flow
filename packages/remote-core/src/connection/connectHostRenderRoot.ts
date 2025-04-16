import type {
  HostExports,
  RemoteExports,
  RemoteToHostConnection,
} from "@/connection/types";
import { RemoteError } from "@/error";
import { type RemoteConnection } from "@mittwald/remote-dom-core/elements";
import { ThreadNestedIframe } from "@quilted/threads";

const incompatibleParentFrameError = () =>
  new RemoteError("Could not find any compatible parent frame");

export const connectHostRenderRoot = async (
  div: HTMLDivElement,
): Promise<RemoteToHostConnection> => {
  const connection = new ThreadNestedIframe<HostExports, RemoteExports>({
    exports: {
      render: (connection: RemoteConnection) =>
        import("@mittwald/remote-dom-core/elements").then(
          ({ RemoteMutationObserver }) => {
            const observer = new RemoteMutationObserver(connection);
            observer.observe(div);
          },
        ),
    },
  });

  if (connection.parent === window) {
    throw incompatibleParentFrameError();
  }

  try {
    await connection.imports.setIsReady();

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

export const connectHostRenderRootRef = (ref: HTMLDivElement | null) => {
  if (ref === null) {
    return;
  }
  if ("__remoteConnection" in ref) {
    return ref["__remoteConnection"] as Promise<RemoteToHostConnection>;
  }

  const connection = connectHostRenderRoot(ref);
  Object.assign(ref, { __remoteConnection: connection });
  return connection;
};
